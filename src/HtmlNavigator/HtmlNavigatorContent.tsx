import * as React from 'react';

const EpubContent = () => {
  return (
    <div className="content" id="root">
      <div id="D2Reader-Container">
        <main style={{ height: 'calc(100vh - 120px)' }} id="iframe-wrapper">
          <div id="reader-loading" className="loading"></div>
          <div id="reader-error" className="error"></div>
        </main>
      </div>
    </div>
  );
};

export default EpubContent;
