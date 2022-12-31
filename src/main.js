//============================================================================//
// Imports
//const fs = require('fs');
//const cheerio = require('cheerio');
//const axios = require('axios');
//const natural = require('natural');
//const path = require('path');
//const seedrandom = require('seedrandom');
//const luxon = require("luxon");

import { readFileSync } from "fs";
import cheerio from "cheerio";
import axios from "axios";
import natural from "natural";
import path from "path";
import seedrandom from "seedrandom";


//============================================================================//
// Constants
var WIKI_ENDPOINT = "https://en.wikipedia.org/w/api.php"

var ALL_FREQUENCY_FNAME = "frequency_data.dat"
var FREQUENCY_CUTOFF = 363503

var SCRAPE_FNAME = "wikiscrape.dat"

var CUSTOM_TOKENS = ["\'\'", "``", "retrieved", "archived", "isbn", "doi", "oclc",
                     "pdf", "original", "'s", "disambiguation", "ibn", "article",
                     "cite", "related", "citations", "list", "may", "edit", "redirects",
                     "vs", "uses", "series", "index", "outline", "part", "using"]

//============================================================================//
// File reading / writing
function read_file_to_array(filename) {
    const file_contents = readFileSync(filename, 'utf8');
    let lines = file_contents.split('\n');
    if (lines[lines.length - 1] === '')
        lines = lines.slice(0, -1);

    return lines;
}

function read_file_to_object(filename) {
    const file_contents = readFileSync(filename, 'utf8');
    const lines = file_contents.split('\n');
    const data = {};

    for (const line of lines)
    {
        const [key, value] = line.split(' ');
        if (key == '')
            continue;
        data[key] = parseInt(value, 10);
    }

    return data;
}

function read_file_to_map(filename) {
    const file_contents = readFileSync(filename, 'utf8');
    const lines = file_contents.split('\n');
    const data = new Map();

    for (const line of lines)
    {
        const [key, value] = line.split(' ');
        if (key == '')
            continue;
        data.set(key, parseInt(value, 10));
    }

    return data;
}

//============================================================================//
// Common word extraction
function create_set_from_map(obj, cutoff) {
    const set = new Set();
    for (const [key, value] of Object.entries(obj)) {
        if (value >= cutoff) {
            set.add(key);
        }
    }
    return set;
}

//============================================================================//
// Article selection
function choose_random_article(articles) {
    const random = Math.floor(Math.random() * articles.length);
    return articles[random];
}

//============================================================================//
// Request function
async function get_wikipedia_page(title) {
    const params = {
        action: 'parse',
        format: 'json',
        page: title,
        prop: 'text',
        //section: 0,
        rvprop: 'content',
        utf8: 1,
        formatversion: 2,
        origin: '*'
    };

    try {
        const response = await axios.get(WIKI_ENDPOINT, { params });

        if (response.status !== 200) {
            const errorMessage = `An error occurred: ${response.status}`;
            console.log(errorMessage);
            throw new Error(errorMessage);
        }

        const text = response.data.parse.text;
        const $ = cheerio.load(text);
        $('style').remove();
        const content = $('div.mw-parser-output').text();

        return content;
    } catch (error) {
        console.log(error);
    }
}

//============================================================================//
// String distance (levenshtein algorithm)
function string_distance(str1, str2) {
    const matrix = [];
    for (let i = 0; i <= str1.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= str2.length; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= str1.length; i++) {
        for (let j = 1; j <= str2.length; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    return matrix[str1.length][str2.length];
}


//============================================================================//
// token functions
function tokenize_text(text) {
    const tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(text);
    return tokens.map(token => token.toLowerCase());
}

function create_frequency_map(tokens) {
    var fdist = new Map();
    for (const token of tokens) {
        if (fdist.has(token)) {
            fdist.set(token, fdist.get(token) + 1);
        } else {
            fdist.set(token, 1);
        }
    }

    return fdist;
}

//============================================================================//
// Filter functions
function filter_stopwords(tokens) {
    const stopwords = natural.stopwords;
    return tokens.filter(token => !stopwords.includes(token));
}

function filter_common_words(tokens, common) {
    return tokens.filter(token => !common.has(token));
}

function filter_punctuation(tokens) {
    tokens = tokens.filter(token => !/[^\w\s]/.test(token));
    return tokens;
}

function filter_custom(tokens, ...args) {
    const custom = new Set(args);
    return tokens.filter(token => !custom.has(token));
}

function filter_length(tokens, n = 1) {
    return tokens.filter(token => token.length > n);
}

function filter_numbers(tokens) {
    return tokens.filter(token => !/^\d+$/.test(token));
}

function filter_title_words(tokens, title) {
    const titleWords = title.split(' ');
    return tokens.filter(token =>
        titleWords.some(t => string_distance(token, t.toLowerCase()) > 2)
    );
}

function apply_all_filters(tokens, title, common) {
  tokens = filter_stopwords(tokens);
  tokens = filter_common_words(tokens, common);
  tokens = filter_numbers(tokens);
  tokens = filter_punctuation(tokens);
  tokens = filter_length(tokens);
  tokens = filter_custom(tokens, ...CUSTOM_TOKENS);
  tokens = filter_title_words(tokens, title);
  return tokens;
}

//============================================================================//
// Clue ordering
function uncommon_ordering(fdist, freq_data) {
    const rval = [];
    for (const [word, count] of fdist) {
        if (count === 1) {
            continue;
        }
        rval.push(word);

        if (!freq_data.has(word))
            freq_data.set(word, 1);
    }

    //rval.sort((a, b) => fdist.get(a)*1.0/freq_data.get(a) > fdist.get(b)*1.0/freq_data.get(b));
    rval.sort((a, b) => freq_data.get(a) < freq_data.get(b));

    //for (a of rval)
    //    console.log(a, fdist.get(a), freq_data.get(a))

    return rval.slice(0, 10);
}

//============================================================================//
// Game class
class Game {
    constructor(title, guesses) {
        let all_article_titles = read_file_to_array(SCRAPE_FNAME);
        this.article_title = title;
        this.ordered_guesses = guesses;
        this.guess_count = 0;
        this.revealed_words = [];
    }

    welcome_message() {
        console.log("Welcome!");
        console.log("A popular Wikipedia article has been picked at random.");
        console.log("Guess the title of the article to reveal common words from that article.");
        console.log("Press enter to continue");
        //prompt();
    }

    more_turns() {
        return this.ordered_guesses.length !== 0;
    }

    secret_print() {
        let str = this.article_title.split("").map(ch => (ch !== " " ? "_" : " ")).join(" ");

        str += "  (";
        const title_words = this.article_title.split(" ");
        for (let i = 0; i < title_words.length; i++) {
            str += `${title_words[i].length}`;
            if (i !== title_words.length - 1) {
                str += ",";
            }
        }
        str += ")";

        console.log(str);
    }

    public_print() {
        console.log("The article is: ");
        console.log(`${this.article_title}`);
    }

    reveal_new_word() {
        this.revealed_words.push(this.ordered_guesses.pop());
    }

    print_all_clues() {
        const total = this.ordered_guesses.length + this.revealed_words.length;
        const current = this.revealed_words.length;
        let current_str = current.toString();

        const num_space = total.toString().length;
        const left_space = num_space * 2 + 5;

        current_str = " ".repeat(num_space - current_str.length) + current_str;

        for (let i = 0; i < this.revealed_words.length; i++) {
            if (i === this.revealed_words.length - 1) {
                console.log(` (${current_str}/${total}) [${this.revealed_words[i]}]`);
            } else {
                console.log(`${" ".repeat(left_space)}[${this.revealed_words[i]}]`);
            }
        }
    }

    async play() {
        //clear_screen();
        this.welcome_message();

        while (this.more_turns()) {
            //clear_screen();
            this.reveal_new_word();
            this.secret_print();
            this.print_all_clues();
            //const user_guess = prompt("Guess the wikipedia article: ");
            const user_guess = "wrong";
            if (user_guess.toLowerCase() === this.article_title.toLowerCase()) {
                this.win_state();
                return;
            }
        }
        this.lose_state();
    }

    win_state() {
        console.log("Win!");
        this.public_print();
    }

    lose_state() {
        console.log("Lose!");
        this.public_print();
    }
}

//============================================================================//
// Main code
async function main() {
    var all_article_titles = read_file_to_array(SCRAPE_FNAME);
    var all_word_frequencies = read_file_to_map(ALL_FREQUENCY_FNAME);
    var common_words = create_set_from_map(all_word_frequencies, FREQUENCY_CUTOFF);

    var article_title = choose_random_article(all_article_titles);
    var page = await get_wikipedia_page(article_title);
    var tokens = tokenize_text(page);
    tokens = apply_all_filters(tokens, article_title, common_words);
    var freq_dist = create_frequency_map(tokens);
    var guess_order = uncommon_ordering(freq_dist, all_word_frequencies);

    var game = new Game(article_title, guess_order);
    game.play();

    // Debug
    //console.log(all_article_titles);
    //console.log(all_word_frequencies);
    //console.log(article_title);
    //console.log(guess_order);
}

//============================================================================//
// Exprt functions
async function get_title_and_hints(daystring) {
        var all_article_titles = read_file_to_array(SCRAPE_FNAME);
        var all_word_frequencies = read_file_to_map(ALL_FREQUENCY_FNAME);
        var common_words = create_set_from_map(all_word_frequencies, FREQUENCY_CUTOFF);

        //var article_title = choose_random_article(all_article_titles);
        var article_title = all_article_titles[Math.floor(seedrandom.alea(daystring)() * all_article_titles.length)];
        var page = await get_wikipedia_page(article_title);
        var tokens = tokenize_text(page);
        tokens = apply_all_filters(tokens, article_title, common_words);
        var freq_dist = create_frequency_map(tokens);
        var guess_order = uncommon_ordering(freq_dist, all_word_frequencies);

        return [article_title, guess_order];
}

export default get_title_and_hints;
