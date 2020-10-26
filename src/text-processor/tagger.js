const natural = require('natural')
const path = require('path')

const rulesFilename = path.join(__dirname, '_files', 'pt_br-ruleset.txt')
const lexiconFilename = path.join(__dirname, '_files', 'pt_br-lexicon.json')
const defaultCategory = 'NN';

const lexicon = new natural.Lexicon(lexiconFilename, defaultCategory);
const rules = new natural.RuleSet(rulesFilename);
const tagger = new natural.BrillPOSTagger(lexicon, rules);

function tag(sentence) {
  tags = tagger.tag(sentence)
  return tags.taggedWords.map(item => [item.token, item.tag])
}

module.exports = {
  tag
}