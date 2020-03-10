<template>
  <div class="body">
    <p>demo</p>
    <div v-if="startDrawing">
      <div v-for="(item, index) in localTrend.val" :key="index" class="item">
        <p class="x-axis">{{ localTrend.key[index] }}</p>
		<transition name="slide">
        <p class="strip" v-show="show" :style="{ width:localTrend.len[index] }" ></p>
		</transition>
        <p class="tag">{{ localTrend.formatVal[index] }}</p>
      </div>
    </div>
	 <button v-on:click="show = !show">
    Toggle
  </button>
  </div>
</template>

// (localTrend.len[index])
// width:localTrend.len[index];
<script>

export default {
  props: {
    trend: {
      type: Object,
      default: () => {
        return {
          'key': ['18日', '1日', '1日', '1日', '1日', '1日', '30日'],
          'val': [15, 1045, 37, 15, 455, 137, 15]
        }
      }
    },
    unitType: {
      type: String,
      default: 'people'
    }
  },
  data () {
    return {
		show:false,
      cWidth2: '', // 横屏图表
      cHeight2: '', // 横屏图表
      pixelRatio: 1,
      itemHeight: 80,
      categoriesNo: 1,
      startDrawing: false,
      localTrend: null
    }
  },
  created () {
    // 条形长度计算公式：
    // diff=max-min
    // len = (n-min)/diff
    let formatVal = []
    let len = []
    this.localTrend = JSON.parse(JSON.stringify(this.trend))
    let { max, min, diff } = this.initial(this.localTrend.val)

    this.localTrend.val.map(val => {
      let itemval = this.unitType === 'people' ? val + '人' : ('￥' + val + (this.isFloat(val) ? '' : '.00'))
      let itemlen = ((val - min) / diff * 100).toFixed(2) + '%'
      formatVal.push(itemval)
      len.push(itemlen)
    })
    this.$set(this.localTrend, 'formatVal', formatVal)
    this.$set(this.localTrend, 'len', len)

    console.log(this.localTrend)
    this.startDrawing = true
  },
  methods: {
    // findKeyframesRule (animName) {
    //   var rule
    //   var ss = document.styleSheets
    //   for (var i = 0; i < ss.length; ++i) {
    //     for (var x = 0; x < ss[i].cssRules.length; ++x) {
    //       rule = ss[i].cssRules[x]

    //       if (rule.name == animName && (rule.type == CSSRule.KEYFRAMES_RULE || ss[i].cssRules[j].type == CSSRule.WEBKIT_KEYFRAMES_RULE)) {
    //         return rule // 可改为 console 查看当前页中所有动画属性值
    //       }
    //     }
    //   }
    // },
    isFloat (n) {
      return n % 1 !== 0
    },
    initial (arr) {
      let copyArr = [...arr]
      let max, min, diff
      copyArr.sort((a, b) => {
        return a - b
      })

      min = copyArr[0]
      max = copyArr[copyArr.length - 1]
      diff = max - min
      return { max, min, diff }
    }

  }
}
</script>

<style scoped lang="scss">
.item{
  display: flex;
  align-items: center;
  padding: 0 30px;
  height: 45px;
  font-size: 0;
  p{
    display: inline-block;
  }
}
.x-axis{
  line-height: 45px;
  min-width: 50px;
  padding-right: 15px;
  text-align: right;
  border-right: 2px solid rgba(185,186,190,1);
  font-size:22px;
  color:rgba(104,107,117,1);

}
.strip{
  // width:0%;
  height:4px;
  background:linear-gradient(-90deg,rgba(70,166,255,1),rgba(144,202,255,1));
  border-radius:0px 2px 2px 0px;
  overflow: hidden;
  // transition: all 2s linear;
 //  animation-name:mymove;
	// animation-duration:1s;
}
@keyframes mymove
{
	from { width:0%;}
	to { width:100%;}
}
.tag{
  padding-left: 12px;
  font-size:22px;
  color:rgba(70,166,255,1);
  flex-shrink:0;
}
.slide-enter-active, .slide-leave-active {
  transition: all 10s ease;
}
.slide-enter, .slide-leave-to /* .fade-leave-active below version 2.1.8 */ {
  width: 0;
}
</style>
