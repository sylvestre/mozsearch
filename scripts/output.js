/**
 * Common output logic that's always evaluated after evaluating `output-lib.js`
 * so its methods are available here.
 **/

function sourcePath(path)
{
  if (path.startsWith("__GENERATED__")) {
    return path.replace("__GENERATED__", objdir);
  }
  return treeRoot + "/" + path;
}

function descriptionPath(path)
{
  return indexRoot + "/description/" + path;
}

function fileURL(tree, path)
{
  return `/${tree}/source/${path}`;
}

function generateBreadcrumbs(path, opt)
{
  let tree = opt.tree;
  let breadcrumbs = `<a href="${fileURL(tree, "")}">${tree}</a>`;
  let pathSoFar = "";
  if (path != "/") {
    for (let name of path.split("/")) {
      breadcrumbs += `<span class="path-separator">/</span>`;
      pathSoFar += name;
      breadcrumbs += `<a href="${fileURL(tree, pathSoFar)}">${name}</a>`;
      pathSoFar += "/";
    }
  }

  return `<div class="breadcrumbs">
    ${breadcrumbs}
  </div>`;
}

function generate(content, opt)
{
  let title = opt.title || "mozsearch";
  let tree = opt.tree;
  let shouldAutofocusQuery = opt.shouldAutofocusQuery || false;
  let query = opt.query || "";
  let isCaseSensitive = opt.isCaseSensitive === undefined ? true : opt.isCaseSensitive;
  let stateOffset = opt.stateOffset || 0;
  let stateLimit = opt.stateLimit || 100;
  let resultCount = opt.resultCount || 100;
  let eof = opt.eof || false;
  let includeDate = opt.includeDate || false;

  let date = "";
  if (includeDate) {
    let generatedDate = String(Date());
    date = `<div id="foot" class="footer">
    This page was generated by Searchfox
    <span class="pretty-date" data-datetime="${generatedDate}"></span>.
  </div>`;
  }

  let output = `<!DOCTYPE html>
<html lang="en-US">
<head>
  <meta charset="utf-8" />
  <link href="/static/icons/search.png" rel="shortcut icon">
  <title>${title}</title>

  <link href="/static/css/mozsearch.css" rel="stylesheet" type="text/css" media="screen"/>
  <link href="/static/css/icons.css" rel="stylesheet" type="text/css" media="screen" />
  <link href="/static/css/filter.css" rel="stylesheet" type="text/css" media="screen" />
  <link href="/static/css/xcode.css" rel="stylesheet" type="text/css" media="screen">
</head>

<body>
<div id="fixed-header">
  <form method="get" action="/${tree}/search" id="basic_search" class="search-box">
    <fieldset>
        <div id="search-box" class="h-flex-container" role="group">
          <div id="query-section">
              <label for="query" class="query_label visually-hidden">Find</label>
              <input type="text" name="q"  value="${query}" maxlength="2048" id="query" accesskey="s" title="Search" placeholder="Search ${tree}" autocomplete="off" ${opt.autofocusSearch ? "autofocus" : ""}/>
              <div class="zero-size-container">
                <div class="bubble" id="query-bubble">
                </div>
              </div>
              <section id="spinner"></section>
          </div>
          <div id="option-section" class="v-flex-container">
              <label for="case">
                  <input type="checkbox" name="case" id="case" class="option-checkbox" value="true" accesskey="c" ${isCaseSensitive ? "checked" : ""}/><span class="access-key">C</span>ase-sensitive
              </label>
              <label for="regexp">
                  <input type="checkbox" name="regexp" id="regexp" class="option-checkbox" value="true" accesskey="r"/><span class="access-key">R</span>egexp search
              </label>
          </div>
          <div id="path-section">
              <label for="path" class="query_label visually-hidden">Path</label>
              <input type="text" name="path"  value="" maxlength="2048" id="path" accesskey="s" title="Search" placeholder="Path filter (supports globbing and ^, $)" autocomplete="off" />
              <div class="zero-size-container">
                <div class="bubble" id="path-bubble">
                </div>
              </div>
          </div>
        </div>
    </fieldset>
    <input type="submit" value="Search" class="visually-hidden" />
  </form>
</div>

<div id="scrolling">
  <div id="content" class="content" data-no-results="No results for current query.">
    ${content}
  </div>

  ${date}

  <!-- avoid inline JS and use data attributes instead. Hackey but hey... -->
  <span id="data" data-root="/" data-search="/${tree}/search" data-tree="${tree}"></span>
  <span id="state" data-offset="${stateOffset}" data-limit="${stateLimit}" data-result-count="${resultCount}" data-eof="${eof}"></span>

  <script src="/static/js/search.js"></script>
  <script src="/static/js/context-menu.js"></script>
  <script src="/static/js/panel.js"></script>
  <script src="/static/js/code-highlighter.js"></script>
</div>
</body>
</html>
`;

  return output;
}
