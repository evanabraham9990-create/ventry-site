(function(d, t) {
  var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
  v.onload = function() {
    window.voiceflow.chat.load({
      verify: { projectID: '69ce82c2b4c5bf250dcb32e2' },
      url: 'https://general-runtime.voiceflow.com',
      versionID: 'production',
      assistant: {
        title: 'Ventry AI',
        description: 'Ask me anything about AI receptionists',
        color: '#6C63FF',
      },
    });
  };
  v.src = "https://cdn.voiceflow.com/widget/bundle.mjs";
  v.type = "text/javascript";
  s.parentNode.insertBefore(v, s);
})(document, 'script');
