function gerarData(data) {
  const dataSql = data.toISOString().replace(/T/, ' ').replace(/\..+/, '')
  return dataSql
}
exports.gerarData = gerarData
