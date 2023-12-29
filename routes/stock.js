const express = require('express')
const router = express.Router()
const axios = require('axios')

async function getKLineData(market, code) {
  const res = await axios.get(`https://push2his.eastmoney.com/api/qt/stock/trends2/get?fields1=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13&fields2=f51,f52,f53,f54,f55,f56,f57,f58&ut=fa5fd1943c7b386f172d6893dbfba10b&secid=${market}.${code}&ndays=5&iscr=0&iscca=0&cb=jsonp1703650213465`)
  var regexp = /\((.*)\)/;
  const result = regexp.exec(res.data)
  if (result) {
    const data = JSON.parse(result[1])
    return data
  }
}

router.get('/', async (req, res, ctx) => {
  let { code } = req.query
  let market = ''
  if (['0', '2', '3', '4', '8'].includes(code[0])) {
    market = '0'
  }
  if (['6', '9'].includes(code[0])) {
    market = '1'
  }
  if (code.length === 5) {
    market = '116'
  }
  if (/[A-Z]|[a-z]/.test(code[0])) {
    market = '107'
    code = code.toUpperCase()
  }
  const data = await getKLineData(market, code)
  res.send(data)
})

module.exports = router