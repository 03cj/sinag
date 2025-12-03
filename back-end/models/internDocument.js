/* eslint-env node */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Define the InternDocument Model
const InternDocument = sequelize.define(
  'InternDocument',
  {
    // 0. Primary Key
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },

    // 1. Link to the Intern (Foreign Key)
    intern_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id',
      },
    },

    // 2. Document Details (FIXED: Removed duplicate 'type' definition)
    document_type: {
      allowNull: false,
      // Use the ENUM type for a fixed list of document types
      type: DataTypes.ENUM('Good Moral', 'COR', 'Medical Clearance', 'Insurance', 'Resume'),
    },

    // 3. File Location (Path to the document storage)
    file_path: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },

    // 4. Review Status (Replaced simple upload_status for full workflow tracking)
    review_status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
      allowNull: false,
      defaultValue: 'PENDING',
    },

    // 5. Advisor Remarks (Required for the front-end display)
    advisor_remarks: {
      type: DataTypes.TEXT, // Use TEXT for potentially long comments
      allowNull: true, // An advisor might approve without a comment
    },

    // Removed original 'upload_status' as 'review_status' handles the document's state better.
  },
  {
    tableName: 'intern_documents',
    timestamps: true,
    createdAt: 'uploaded_at', // When the document was first uploaded
    updatedAt: 'updated_at', // When the status or remarks were last changed

    indexes: [
      {
        unique: true,
        fields: ['intern_id', 'document_type'],
        name: 'intern_document_unique_constraint',
      },
    ],
  },
);

module.exports = InternDocument;
