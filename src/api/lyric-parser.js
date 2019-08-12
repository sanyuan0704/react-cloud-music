const timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g

const STATE_PAUSE = 0
const STATE_PLAYING = 1

const tagRegMap = {
  title: 'ti',
  artist: 'ar',
  album: 'al',
  offset: 'offset',
  by: 'by'
}

function noop() {
}

export default class Lyric {
  constructor(lrc, hanlder = noop) {
    this.lrc = lrc
    this.tags = {}
    this.lines = []
    this.handler = hanlder
    this.state = STATE_PAUSE
    this.curLine = 0

    this._init()
  }

  _init() {
    this._initTag()

    this._initLines()
  }

  _initTag() {
    for (let tag in tagRegMap) {
      const matches = this.lrc.match(new RegExp(`\\[${tagRegMap[tag]}:([^\\]]*)]`, 'i'))
      this.tags[tag] = matches && matches[1] || ''
    }
  }

  _initLines() {
    const lines = this.lrc.split('\n')
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      let result = timeExp.exec(line)
      if (result) {
        const txt = line.replace(timeExp, '').trim()
        if (txt) {
          this.lines.push({
            time: result[1] * 60 * 1000 + result[2] * 1000 + (result[3] || 0) * 10,
            txt
          })
        }
      }
    }

    this.lines.sort((a, b) => {
      return a.time - b.time
    })
  }

  _findCurNum(time) {
    for (let i = 0; i < this.lines.length; i++) {
      if (time <= this.lines[i].time) {
        return i
      }
    }
    return this.lines.length - 1
  }

  _callHandler(i) {
    if (i < 0) {
      return
    }
    this.handler({
      txt: this.lines[i].txt,
      lineNum: i
    })
  }

  _playRest() {
    let line = this.lines[this.curNum]
    let delay = line.time - (+new Date() - this.startStamp)

    this.timer = setTimeout(() => {
      this._callHandler(this.curNum++)
      if (this.curNum < this.lines.length && this.state === STATE_PLAYING) {
        this._playRest()
      }
    }, delay)
  }

  play(startTime = 0, skipLast) {
    if (!this.lines.length) {
      return
    }
    this.state = STATE_PLAYING

    this.curNum = this._findCurNum(startTime)
    this.startStamp = +new Date() - startTime

    if (!skipLast) {
      this._callHandler(this.curNum - 1)
    }

    if (this.curNum < this.lines.length) {
      clearTimeout(this.timer)
      this._playRest()
    }
  }

  togglePlay() {
    var now = +new Date()
    if (this.state === STATE_PLAYING) {
      this.stop()
      this.pauseStamp = now
    } else {
      this.state = STATE_PLAYING
      this.play((this.pauseStamp || now) - (this.startStamp || now), true)
      this.pauseStamp = 0
    }
  }

  stop() {
    this.state = STATE_PAUSE
    clearTimeout(this.timer)
  }

  seek(offset) {
    this.play(offset)
  }
}
