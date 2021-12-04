require('dotenv').config();

module.exports = {
    student_achievements_folder_id: process.env.STUDENT_ACHIEVEMENT_FOLDER_ID,
    all_departments: ["CE","ME","EE","EC","IM","CS","TE","IS","EI","ML","BT","CH","AS","AM"],
    index_table_id: process.env.INDEX_TABLE_ID
}