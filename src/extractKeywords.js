const processor = require("./text-processor");
const retext = require("retext");
const toString = require("nlcst-to-string");

module.exports = (text) =>
  new Promise((resolve, reject) => {
    retext()
      .use(processor.pos)
      .use(processor.keywords)
      .process(text, (error, file) => {
        if (error) reject(error);

        resolve({
          keywords: file.data.keywords.map((keywords) =>
            toString(keywords.matches[0].node)
          ),
          keyphrases: file.data.keyphrases.map((phrase) =>
            phrase.matches[0].nodes.map((value) => toString(value)).join("")
          ),
        });
      });
  });
