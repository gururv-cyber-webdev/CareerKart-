const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function ensureAdmin() {
  try {
    const adminEmail = "Admin123@gmail.com";
    const adminPassword = "pass123";
    const adminName = "Admin"; // ✅ Optional name field (for consistency)

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail, role: "admin" });

    if (!existingAdmin) {
      // Hash default password
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      // Create default admin user
      await User.create({
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        status: "approved",     // ✅ Directly approved
        name: adminName         // ✅ Optional name field
        // You can also add profilePic, idProof, etc., if needed
      });

      console.log("✅ Default admin created successfully!");
    } else {
      console.log("ℹ️ Admin already exists.");
    }
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
  }
}

module.exports = ensureAdmin;
