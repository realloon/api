const fetch = require('node-fetch')

// environment variable: process.env.[key]
const url = process.env.URL
const cookie = process.env.COOKIE

async function getTrafficData() {
  const resp = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: { Cookie: cookie },
  })

  const html = await resp.text()
  let trafficArray = html.match(/(?<=<span>)\d+.\d+(GB|MB)(?=<\/span>)/g)

  trafficArray = trafficArray.map(item => {
    let number = item.slice(0, item.length - 2)

    return item[item.length - 2] === 'M' ? +(number / 1024).toFixed(2) : +number
  })

  const totleData = trafficArray[0] + trafficArray[3] + trafficArray[6]
  const usedData = trafficArray[1] + trafficArray[4] + trafficArray[7]
  const stillData = trafficArray[2] + trafficArray[5] + trafficArray[8]

  return { totleData, usedData, stillData }
}

exports.handler = async (req, resp, context) => {
  resp.setHeader('Content-Type', 'application/json')

  const r = await getTrafficData()

  resp.send(JSON.stringify(r))
}
