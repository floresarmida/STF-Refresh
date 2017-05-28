import config from 'config'

const createAppScript = () => '<script type="text/javascript" charset="utf-8" src="/assets/app.js"></script>';

const createTrackingScript = () => config.has('analytics.google') ? createAnalyticsSnippet(config.get('analytics.google')) : '';

const createAnalyticsSnippet = id =>
  `<script>
window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
ga('create', '${id}', 'auto');
ga('send', 'pageview');
</script>
<script async src='https://www.google-analytics.com/analytics.js'></script>`;

const createStylesheets = () => '<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto+Condensed" />';

export { createAppScript, createTrackingScript, createStylesheets };