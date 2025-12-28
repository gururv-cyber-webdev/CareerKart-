const fs = require("fs");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

// S3 client using v3 SDK
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Document generator (unchanged)
exports.generateDoc = (mentor) => {
  let doc = `Mentor: ${mentor.name}\nJob Role: ${mentor.jobRole}\n\n`;
  mentor.qa.forEach((item, i) => {
    doc += `Q${i + 1}: ${item.q}\nA: ${item.a}\n\n`;
  });
  return doc;
};

// Document generator and uploader (refactored for AWS SDK v3)
exports.generateDocAndUpload = async (mentor) => {
  // Generate doc content
  const docContent = exports.generateDoc(mentor);
  const docName = `mentor_${mentor._id}.txt`;
  const key = `mentors/${docName}`;

  // Write temp file
  fs.writeFileSync(docName, docContent);
  const fileContent = fs.readFileSync(docName);

  // Prepare and send S3 upload command
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    Body: fileContent,
    ContentType: "text/plain",
  });

  try {
    await s3.send(command);
  } finally {
    // Clean up temp file no matter what
    fs.unlinkSync(docName);
  }
};