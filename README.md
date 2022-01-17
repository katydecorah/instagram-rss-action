# Instagram RSS action

A GitHub action that generates an RSS feed from a list of public Instagram accounts.

## Note about the Instagram API

This action uses [instagram-web-api](https://www.npmjs.com/package/instagram-web-api). The action only requires authentication in the form of your Instagram username and can only fetch posts from public Instagram accounts.

If you see this error: `TypeError: Cannot read property 'user' of undefined`. Either the Instagram account you entered is invalid or Instragram is ratelimiting your request. If the latter, try reducing your schedule to once or twice a day.

## Setup

To create an Instagram RSS feed that updates once a day and automatically commits the feed to your repository:

1. Make sure your GitHub repository has [GitHub Pages](https://pages.github.com/) enabled. Your feed URL will be whatever your domain is and then `instagram.json` (Example: https://katydecorah.com/instagram-rss-action/instagram.json). You can also change the feed filename using the `fileName` option.
1. Create `.github/workflows/instram-rss.yml` file using the following template: