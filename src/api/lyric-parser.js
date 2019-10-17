/**version:1.0.0
 * 传入歌词，按照正则表达式解析
 * 解析的数据结构为：
 * {
 *   txt:歌词，
 *   time:ms
 * }
 */

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
  constructor(lrc, hanlder = noop, speed = 1) {
    this.lrc = lrc
    this.tags = {}
    this.lines = []
    this.handler = hanlder
    this.state = STATE_PAUSE
    this.curLine = 0
    this.speed = speed

    this._init()
  }

  _init() {
    this._initTag()

    this._initLines()
  }

  _initTag() {
    for (let tag in tagRegMap) {
      const matches = this.lrc.match(new RegExp(`\\[${tagRegMap[tag]}:([^\\]]*)]`, 'i'))
      this.tags[tag] = matches && (matches[1] || '')
    }
  }

  _initLines() {
    const lines = this.lrc.split('\n')
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      let result = timeExp.exec(line)
      if (result) {
        const txt = line.replace(timeExp, '').trim();
        if (txt) {
          if (result[3].length === 3) {
            result[3] = result[3]/10;
          }
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

  _playRest(isSeek=false) {
    let delay;
    let line = this.lines[this.curNum]
    if(isSeek) {
      delay = line.time - (+new Date() - this.startStamp);
    }else {
      //拿到上一行的歌词开始时间，算间隔
      let preTime = this.lines[this.curNum - 1] ? this.lines[this.curNum - 1].time : 0;
      delay = line.time - preTime;
    }
    this.timer = setTimeout(() => {
      this._callHandler(this.curNum++)
      if (this.curNum < this.lines.length && this.state === STATE_PLAYING) {
        this._playRest()
      }
    }, (delay / this.speed))
  }

  changeSpeed(speed) {
    this.speed = speed;
  }

  play(startTime = 0, isSeek = false) {
    if (!this.lines.length) {
      return
    }
    this.state = STATE_PLAYING

    this.curNum = this._findCurNum(startTime)
    //现在正处于第this.curNum-1行
    this._callHandler(this.curNum-1);
    this.startStamp = +new Date() - startTime

    if (this.curNum < this.lines.length) {
      clearTimeout(this.timer)
      this._playRest(isSeek)
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
    this.play(offset, true)
  }
}
