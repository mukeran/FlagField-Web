# Flagfield-Web

Official web client of FlagField.

## Build

1. `git clone https://github.com/FlagField/FlagField-Web && cd FlagField-Web`;
2. `npm install` (Recommend `cnpm install` in China);
3. edit `API_ROOT` in `src/constants.js` to your FlagField-Server address (including /v1). Notice that the URL should follow your browser's CORS rule in order to access;
4. `npm run build`. The files are now generated at ./dist/;
5. Using Apache2 or NGINX to make your website accessible. 

## Notice

 - There's still a lot of stuff remaining to be finished
 - There're lots of potential bugs in this program
 - User register's interface is always asking email captcha
 - The files may be too large
 - Unit tests are not available now