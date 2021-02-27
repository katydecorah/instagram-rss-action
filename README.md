# Instagram RSS action

A GitHub action that generates an RSS feed from a list of public Instagram accounts.

## Note about the Instagram API

This action uses [instagram-web-api](https://www.npmjs.com/package/instagram-web-api). The action only requires authentication in the form of your Instagram username and can only fetch posts from public Instagram accounts.

If you see this error: `TypeError: Cannot read property 'user' of undefined`. Either the Instagram account you entered is invalid or Instragram is ratelimiting your request. If the latter, try reducing your schedule to once or twice a day.

## Setup

To create an Instagram RSS feed that updates once a day and automatically commits the feed to your repository:

1. Make sure your GitHub repository has [GitHub Pages](https://pages.github.com/) enabled. Your feed URL will be whatever your domain is and then `instagram.json` (Example: https://katydecorah.com/instagram-rss-action/instagram.json). You can also change the feed filename using the `fileName` option.
1. Create `.github/workflows/instram-rss.yml` file using the following template:

<!-- START GENERATED SETUP -->

```yml
name: RSS
"on":
  schedule:
    - cron: 0 17 * * *
jobs:
  generate_rss:
    runs-on: macOS-latest
    name: Generate RSS
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: RSS
        uses: katydecorah/instagram-rss-action@v0.1.0
        with:
          yourInstagram: YOUR-INSTRAGRAM
          listOfInstagrams: "nytcooking,sohlae,swissmiss,soulfirefarm"
      - name: Commit files
        run: >
          git config --local user.email "action@github.com"

          git config --local user.name "GitHub Action"

          git add -A && git commit -m "Updated instagram.json"

          git push
          "https://${GITHUB_ACTOR}:${{secrets.GITHUB_TOKEN}}@github.com/${GITHUB_REPOSITORY}.git"
          HEAD:${GITHUB_REF}
```

<!-- END GENERATED SETUP -->

## Options

<!-- START GENERATED OPTIONS -->

- `yourInstagram`: Required. Your Instagram username. This is required for authentication with the Instagram API.
- `listOfInstagrams`: Required. Public Instagram usernames comma delimited.
- `fileName`: The name of the JSON feed file name to be written. Default: `instagram.json`.
- `feedTitle`: The title of the RSS feed. This will appear as the title of the feed in your RSS reader. Default: `Instagram`.
- `pretty`: Remove hashtags and emoji from captions. Default: `true`.

<!-- END GENERATED OPTIONS -->
