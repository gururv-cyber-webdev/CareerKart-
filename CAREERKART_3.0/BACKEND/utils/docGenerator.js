exports.generateDoc = (mentor) => {
  let doc = `Mentor: ${mentor.name}\nJob Role: ${mentor.jobRole}\n\n`;
  mentor.qa.forEach((item, i) => {
    doc += `Q${i + 1}: ${item.q}\nA: ${item.a}\n\n`;
  });
  return doc;
  };