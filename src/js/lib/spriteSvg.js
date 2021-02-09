function requireAll(r) {
  r.keys().forEach(r);
}

requireAll(require.context('../../img/sprite-svg/', true, /\.svg$/));