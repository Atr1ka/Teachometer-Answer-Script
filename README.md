# Teachometer-Answer-Script
A script to find the answers to a teachometer.co.uk lesson.  
  
Use by copy pasting the contents of script.min.js into the URL section of a bookmark. When you are on a teachometer page, click the bookmark and it will ask you what question number to solve. You can also type ***all*** to solve every question or ***all check*** to solve every question and check answers.  
  
# Known Issues
- If there is a bugged question and you try to get the answer to every question at once, it will stop at the bugged one instead of continuing past it.
- On some types of multiple choice questions, the answer checker is case-insensitive but automattically selecting the right answer is case-sensitive so it may not work. 
  - e.g., if the answers say the answer should be ***Power supply***, but the only option to select is ***Power Supply***, it will cause an error.
