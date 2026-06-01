import fs from 'fs';
import path from 'path';

const csvData = `12Stone Church,info@12stone.com,Mega-Church,12stone.com,https://en.wikipedia.org/wiki/Special:FilePath/12Stone_Church.png
Gwinnett Stripers,shop@gostripers.com,Minor League Baseball,gostripers.com,https://en.wikipedia.org/wiki/Special:FilePath/Gwinnett_Stripers_logo.svg
Georgia Gwinnett College,StudentAffairs@ggc.edu,Higher Education,ggc.edu,https://en.wikipedia.org/wiki/Special:FilePath/Georgia_Gwinnett_College_logo.png
Slow Pour Brewing Company,info@slowpourbrewing.com,Brewery,slowpourbrewing.com,https://logo.clearbit.com/slowpourbrewing.com
Gwinnett Chamber of Commerce,info@gwinnettchamber.org,Chamber of Commerce,gwinnettchamber.org,https://logo.clearbit.com/gwinnettchamber.org
`;

const filePath = path.join(process.cwd(), 'scripts', 'leads.csv');

if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, 'Organization Name,Contact Email,Industry,Website,Logo URL\n');
}

fs.appendFileSync(filePath, csvData);
console.log("Appended leads to scripts/leads.csv");
