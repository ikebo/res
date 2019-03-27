# 跟随弹窗位置的确定，以及位置自适应-获取dom元素的确定位置，智能显示跟随弹框

 我们在页面弹窗中，总会需要一些弹窗能够跟随DOM的位置出现，叫做“跟随弹窗”。而跟随弹窗最好的要求就是要能根据dom元素所在的位置自动调整跟随dom的方位，以便让弹框完整的显示在可视区中。由于这个实现需要比较麻烦的算法，我们通常的写法就是根据直接让弹窗的左上角对齐dom元素的左下角或者左上角。这样写出的弹窗适应性比较差。

 今天我们就来讲解一下让弹窗能自动调节跟随方位的算法问题。
 
 ![](http://webfront-js.com/other/20161221/1482329791472056909.png)
 
 下面空间不足的时候，跟随弹窗自动显示在dom的上方。
 
 ![](http://webfront-js.com/other/20161221/1482329791866081646.png)
 
 ![](http://webfront-js.com/other/20161221/1482329791492037604.png)
 
 上下空间都不足的时候，让跟随弹框显示在空间较大的方向，并且通过overflow:auto来调出滚动条展现内容
 
 ![](http://webfront-js.com/other/20161221/1482329791326082811.png)
 
 正常情况下下方空间足够大时跟随弹窗显示的位置。
 
 ![](http://webfront-js.com/other/20161221/1482334102131070649.png)
 
 左右宽度不够的的时候出现横向滚动条。
 
 ![](http://webfront-js.com/other/20161221/1482334102084048733.png)
 
 跟随弹窗宽度大于dom元素宽度并且页面空间足够时，扩大弹窗的宽度。

我们要能让我们的跟随弹窗达到上面这几种自适应，那就是一个完美的跟随弹窗了。我们都用过My97date这个日历插件，它其实就有这种功能。那么我们下面来说一下这种弹窗定位的实现逻辑。

```html
<input type='text' onclick='pop(this,event)' class='input-text'/>
<!--跟随弹窗的内容-->
<script type='text/template' id='tipwin'>
    <div class='popwin'>
        <ul>
            <li>小巧流水人家</li>
            <li>天边云卷云舒</li>
            <li>这下厉害了</li>
            <li>夕阳无限好，只是近黄昏</li>
            <li>百里平川</li>
            <li>我们的春天</li>
            <li>老吾老以及人之老，幼吾幼以及人之幼-孟子，天地不仁，以万物为刍狗</li>
            <li>三人行，必有我师焉<li>
        </ul>
    </div>
</script>
<style>
body{margin:0;padding:0;background:#f7f7f7;}
.cont{padding:25px;font-size:15px;line-height:32px;}
.input-text{height:32px;font-size:13px;border:1px solid #aaa;width:230px;}
.popwin ul{margin:0;padding:0;list-style:none;padding:12px 0;}
.popwin ul li{line-height:30px;color:#C69E13;font-size:13px;cursor:pointer;
box-sizing:border-box;padding:0 8px;white-space:nowrap;}
.popwin ul li:hover{background:#0D6BA6;}
</style>
```

点击这个输入框的时候调用跟随弹窗出来，
``` javascript
function pop(th,event){
        //阻止事件冒泡
    var evt=event||window.event;
    if(evt.stopPropagation){
        evt.stopPropagation();
    }else{
        evt.cancelBubble=true;
    }
    //得到dom元素的矩形，这个方法很好用
    var rect=th.getBoundingClientRect();
    //得到dom元素的宽高，ie8-不支持rect.width,rect.height
    var basew=rect.right-rect.left;
    var baseh=rect.bottom-rect.top;
     
    //得到浏览器的客户区宽高
    var docw=document.documentElement.clientWidth;
    var doch=document.documentElement.clientHeight;
     
    //判断dom元素的左边空间大还是右边空间大
    var isleft=docw-rect.left<rect.right?true:false;
     
    //判断dom元素的上边空间大还是下面空间大
    var istop=doch-rect.bottom<rect.top?true:false;
     
    //得到页面的滚动高度。
    var scrollw=Math.max(document.documentElement.scrollWidth,document.body.scrollWidth);
     
    //将弹窗显示在左上角位置
    var div=document.createElement("div");
    //这里的\是为了\空格，让字符串能够换行
    div.style.cssText="position:absolute;z-Index:20;background:#fff;\
    border:1px solid #ddd;left:0;\
    top:0;box-sizing:border-box;";
    div.innerHTML=document.getElementById("tipwin").innerHTML;
    document.body.appendChild(div);
     
    //得到div的宽高
    var drect=div.getBoundingClientRect();
    var dw=drect.right-drect.left;
    var dh=drect.bottom-drect.top;
         
     
    //先判断div跟input是左对齐还是右对齐
    //div宽度大于右边的宽度，并且左边空间比右边大时是右对齐
    //判断是用right还是left定位
    var loc_isright=(dw>(docw-rect.left)&&isleft)?true:false;
     
    //定位的数值大小
    var left=(dw>(docw-rect.left)&&isleft)?rect.right:rect.left;
     
    //判断div是否超出客户区空间大小，需要加宽度
    var ismax=(dw>docw-rect.left)&&dw>rect.right?true:false;
    var max_w;
     
    //如果需要计算最大宽度
    if(ismax){
        max_w=(docw-rect.left)>(rect.right)?(docw-rect.left):rect.right;
    }
     
    //如果div小于input的宽度采用input的宽度
    var ismin=dw<basew;
    if(ismin){
        max_w=basew;
    }
     
    //判断上下的位置
    //采用top，因为相对于body定位bottom的位置跟body是否有relative相关
    var top=(dh>doch-rect.bottom)&&istop?(rect.top>dh?rect.top-dh:0):rect.bottom;
     
    //是否需要最大高度
    var ismax_h=dh>doch-rect.bottom&&dh>rect.top?true:false;
    var max_h;
     
    //计算最大高度
    if(ismax_h){
        max_h=doch-rect.bottom>rect.top?(doch-rect.bottom):rect.top;
    }
    //得到滚动条的位置。
    var scrollTop=document.documentElement.scrollTop||window.pageYOffset||document.body.scrollTop;
    var scrollLeft=document.documentElement.scrollLeft||window.pageXOffset||document.body.scrollLeft;
     
    //设置左右的位置
    if(loc_isright){
     //先清空left定位再设置right
            div.style.left="";
             
        div.style.right=(scrollw-(left+scrollLeft))+"px";
    }else{
        div.style.left=(left+scrollLeft)+"px";
    }
    //设置top的定位
    div.style.top=(top+scrollTop)+"px";
     
    //设置宽度
    if(ismax||ismin){
        div.style.width=max_w+"px";
        if(ismax){
            div.style.overflowX="auto";
        }
    }
    //设置高度
    if(ismax_h){
        div.style.height=max_h+"px";
        div.style.overflowY="auto";
    }
}
```

 先把整体代码贴上去，然后我们再来分析计算逻辑，（其实注释已经很详细了）。这个效果我之前采用的算法是，先设置div在input的左下角对齐，然后再判断div是否超出宽度和高度，如果超出并且另一个位置比他大，则改变位置，最后如果还超出，则设置宽高调用滚动条显示内容。

    上面的代码，我是采用了新的算法，逻辑比之前的更清楚了。

    1，我们先通过getBoundingClientRect方法（此方法可以获得元素在浏览器的矩形位置）获得dom元素宽高和位置。

   2，获得浏览器窗口客户区的宽高。

   3，通过docw-rect.left<rect.right比较左右空间的大小。


![](http://webfront-js.com/other/20161221/1482335644003005310.png)

上图是左右空间距离的示意。

4,通过doch-rect.bottom<rect.top判断上下空间的大小。

5，创建弹窗的div添加的body中，并设置位置再浏览器左上角。

6，得到弹窗div的宽高，

7，通过dw>docw-rect.left&&islieft判断左右位置是用left值还是right值定位。使用这个是因为如果我们都用left值定位的时候，而我们让div的右边对齐了input的右边后，如果客户区上下空间不够，出现纵向滚动条，而左右空间充足，我们没有限定宽度时，滚动条的出现会使div的宽度增加，导致右边跟div跑偏一个滚动条的位置。所以我们采用right定位的时候，div多出的宽度时向左走的，右边依然是对齐的。

8，通过(dw>(docw-rect.left)&&isleft)?rect.right:rect.left来设置左右位置的大小，左对齐就取dom左边的距离，右对齐就取dom右边的距离，这个右边right的距离设置时在下面还有计算。

9，判断是否需要设置div的宽度。

10，通过(dh>doch-rect.bottom)&&istop?(rect.top>dh?rect.top-dh:0):rect.bottom判断top值的位置，上下位置也可以采用跟左右位置一样的算法，取舍应该设置top还是bottom，我们这里是为了说明可以采用两种算法实现就使用了不同的。

    这里使用bottom要注意一点：如果body没有设置relative，那么bottom：0是相对于一个初始化容器设置的，而这个初始化容器就是浏览器窗口的宽高，就是说如果body没有relative属性，bottom：0=top：浏览器客户区的高度。而body设置了relative时，bottom：0才会呈现我们想要的效果，是相对于页面的底部进行计算的。

11，判断涉及div的高度。

12, 设置div的left或right值，设置right的时候是scrollw-(left+scrollLeft)，横向滚动长度容器左边的距离和滚动条的长度，得到距离页面右边的距离。

13，设置div的top值。

14，设置div的宽高。并且设置overflow属性。

代码都分析完了，总得给个demo体验一下效果不是，在PC端点击这里查看跟随弹窗智能定位的效果。你可以改变浏览器的大小来查看适应情况。

通过上面的算法计算，我们的跟随div就拥有自适应跟随位置的能力了。这个算法也不算太完善，对于滚动条出现导致div宽高变化的处理我只想到这中处理方式，可能有更好的处理方式。其实还有一些细节需要用递归的方式判断，比如上下滚动条的出现导致了左右空间不足，需要出现横向滚动条，那么横向滚动条的出现也可能导致纵向空间的不足，需要出现纵向滚动条。

抛弃一些没有处理的细节，上面的算法在绝大多数情况下是可以适用的。

今天我们用一个实例功能讲解了一个算法的逻辑和实现。我感觉js中很多效果的实现不是我们对dom操作和js语言的不熟悉，主要是对算法和思想观念的不达标，就比如angularJs，它所拥有的我们不如的不是其中的js语法多牛逼，也不是算法多高深，是其思想层次比我们高一个层次，软件设计理念是很重要的。

[原文地址](http://webfront-js.com/articaldetail/23.html)
