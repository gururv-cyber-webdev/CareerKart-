const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2021-08-01',
  authenticator: new IamAuthenticator({
    apikey: process.env.WATSON_NLU_APIKEY, // 👈 Make sure this is defined
  }),
  serviceUrl: process.env.WATSON_NLU_URL, // 👈 Set your NLU URL from IBM Cloud
});

exports.summarize = async (text) => {
  const analyzeParams = {
    text,
    features: {
      keywords: {
        limit: 10,
      },
    },
  };

  const analysisResults = await naturalLanguageUnderstanding.analyze(analyzeParams);
  return analysisResults.result;
};
