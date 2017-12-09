let loadingRender = (function () {
    let $loadingBox = $(".loadingBox"),
        $run = $loadingBox.find(".run");
    let imgList = ["img/icon.png", "img/zf_concatAddress.png", "img/zf_concatInfo.png", "img/zf_concatPhone.png", "img/zf_course.png", "img/zf_course1.png", "img/zf_course2.png", "img/zf_course3.png", "img/zf_course4.png", "img/zf_course5.png", "img/zf_course6.png", "img/zf_cube1.png", "img/zf_cube2.png", "img/zf_cube3.png", "img/zf_cube4.png", "img/zf_cube5.png", "img/zf_cube6.png", "img/zf_cubeBg.jpg", "img/zf_cubeTip.png", "img/zf_emploment.png", "img/zf_messageArrow1.png", "img/zf_messageArrow2.png", "img/zf_messageChat.png", "img/zf_messageKeyboard.png", "img/zf_messageLogo.png", "img/zf_messageStudent.png", "img/zf_outline.png", "img/zf_phoneBg.jpg", "img/zf_phoneDetail.png", "img/zf_phoneListen.png", "img/zf_phoneLogo.png", "img/zf_return.png", "img/zf_style1.jpg", "img/zf_style2.jpg", "img/zf_style3.jpg", "img/zf_styleTip1.png", "img/zf_styleTip2.png", "img/zf_teacher1.png", "img/zf_teacher2.png", "img/zf_teacher3.jpg", "img/zf_teacher4.png", "img/zf_teacher5.png", "img/zf_teacher6.png", "img/zf_teacherTip.png"];

    //控制图片加载进度,金酸滚动条加载长度
    let total = imgList.length,
        cur = 0;
    let computed = function () {
        imgList.forEach(function (item) {
            let tempImg = new Image;
            tempImg.src = item;
            tempImg.onload = function () {
                tempImg = null;
                cur++;
                runFn()
            }
        })

    };
    let runFn = function () {
        $run.css("width", cur / total * 100 + "%");
        if (cur >= total) {
            //=>需要延迟的图片都加载成功了:进入到下一个区域
            let delayTimer = setTimeout(() => {
                $loadingBox.remove();
                phoneRender.init()
            }, 1500)
        }
    };

    return {
        init: function () {
            $loadingBox.css("display", "block");//我们在css当中吧所有的区域都设置为none,以后开发的时候开发那个区域我们就执行那个区域的init方法,在这个方法中首先控制当前区域展示(开发那个区域,那个区域展示,其他区域都是隐藏)
            computed()
        }
    }
})();
let phoneRender = (function ($) {
    let $phoneBox = $(".phoneBox"),
        $time = $phoneBox.find(".time"),
        $listen = $phoneBox.find(".listen"),
        $listenTouch = $listen.find(".touch"),
        $detail = $phoneBox.find(".detail"),
        $detailTouch = $detail.find(".touch");


    let audioBell = $("#audioBell")[0],
        audioSay = $("#audioSay")[0];


    let $phonePlan = $.Callbacks();
    $phonePlan.add(function () {
        $listen.remove();
        $detail.css("transform", "translateY(0)")
    });
    $phonePlan.add(function () {
        audioBell.pause();
        audioSay.play();
        $time.css("display", "block");

        let sayTimer = setInterval(() => {
            //=>总时间和已经播放时间
            let duration = audioSay.duration,
                current = audioSay.currentTime;

            let minute = Math.floor(current / 60);
            current = current - minute * 60;
            let second = Math.floor(current);
            minute < 10 ? minute = "0" + minute : null;
            second < 10 ? second = "0" + second : null;
            $time.html(`${minute}:${second}`);
            if (current >= duration) {
                clearInterval(sayTimer);
                enterNext()
            }
        }, 1000)
    });

    let enterNext = function () {
        audioSay.pause();
        $phoneBox.remove();
        messageRender.init()
    };

    $phonePlan.add(() => $detailTouch.tap(enterNext))
    return {
        init: function () {
            $phoneBox.css("display", "block");
            audioBell.play();
            $listenTouch.tap($phonePlan.fire);
        }
    }
})(Zepto);

let messageRender = (function ($) {
    let $messageBox = $(".messageBox"),
        $talkBox = $messageBox.find(".talkBox"),
        $talkList = $talkBox.find("li"),
        $keyBord = $messageBox.find(".keyBord"),
        $submit = $keyBord.find(".submit"),
        $keyBordText = $keyBord.find("span"),
        musicAudio = $messageBox.find("#musicAudio")[0];
    let $plan = $.Callbacks();
    let step = -1,
        autoTimer = null,
        interval = 1500,
        offset = 0;

    $plan.add(() => {
        musicAudio.play();
        autoTimer = setInterval(() => {
            step++;
            let $cur = $talkList.eq(step);
            $cur.css({
                opacity: 1,
                transform: "translateY(0)"
            });
            //=>当第三条完全展示后立即调取出键盘
            if (step === 2) {
                //=>transitionend 当前元素正在运行的动画已经完成就会触发这个事件(有几个元素样式需要改变就会被触发几次)
                $cur.one("transitionend", () => {
                    //=>one:JQ中的事件绑定方法,想要实现当前事件只绑定一次,触发一次后,给事件绑定的方法自动移除
                    $keyBord.css("transform", "translateY(0)").one("transitionend", textMove)
                });
                clearInterval(autoTimer);
                return
            }
            //=>从第五条开始,每当展示一个li都需要让ul整体上移
            if (step >= 4) {
                offset += -$cur[0].offsetHeight;
                $talkBox.css({
                    transform: `translateY(${offset}px)`
                })
            }
            if (step >= $talkList.length - 1) {
                clearInterval(autoTimer);
                let delayTimer = setInterval(() => {
                    musicAudio.pause();
                    $messageBox.remove();
                    cubeRender.init();
                    clearInterval(delayTimer);
                }, interval)
            }
        }, interval)
    });
    let textMove = function () {
        let text = $keyBordText.html();
        $keyBordText.css("display", "block").html("");
        let timer = null,
            n = -1;
        timer = setInterval(() => {
            if (n>= text.length) {
                clearInterval(timer);
                //打印机效果完成 让提交按钮显示(给发送绑定事件)
                $submit.css("display", "block").tap(() => {
                    $keyBordText.css("display", "none");
                    $keyBord.css("transform", "translateY(3.7rem)");
                    $plan.fire()//因为此时计划表中只有一个方法,重新通知这个计划表执行
                });
                $keyBordText.html(text)
            }
            n++;
            $keyBordText[0].innerHxTML+= text.charAt(n);
        }, 100)

    };

    return {
        init: function () {
            $messageBox.css("display", "block");
            $plan.fire()
        }
    }
})(Zepto);

let cubeRender = (function () {
    let $cubeBox = $(".cubeBox"),
        $Box = $cubeBox.find(".box");

    let touchBegin = function (e) {
        //=>this:Box
        let point = e.changedTouches[0];
        $(this).attr({
            strX: point.clientX,
            strY: point.clientY,
            isMove: false,
            changeX: 0,
            changeY: 0
        })
    };
    let touching = function (e) {
        let point = e.changedTouches[0],
            $this = $(this);
        let changeX = point.clientX - parseFloat($this.attr("strX")),
            changeY = point.clientY - parseFloat($this.attr("strY"));
        if (Math.abs(changeX) > 10 || Math.abs(changeY) > 10) {
            $this.attr({
                changeX: changeX,
                changeY: changeY,
                isMove: true
            })
        }

    };
    let touchEnd = function (e) {
        let point = e.changedTouches[0],
            $this = $(this);
        let isMove = $this.attr("isMove"),
            changeX = parseFloat($this.attr("changeX")),
            changeY = parseFloat($this.attr("changeY")),
            rotateX = parseFloat($this.attr("rotateX")),
            rotateY = parseFloat($this.attr("rotateY"));
        if (isMove === "false") return;
        rotateX = rotateX - changeY / 3;
        rotateY = rotateY + changeX / 3;
        $this.css("transform", `scale(.6) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`).attr({
            rotateX: rotateX,
            rotateY: rotateY
        })
    };


    return {
        init: function () {
            $cubeBox.css("display", "block");

            $Box.attr({
                rotateX: -30,
                rotateY: 45
            }).on({
                touchstart: touchBegin,
                touchmove: touching,
                touchend: touchEnd
            });
            $Box.find("li").tap(function () {
                $cubeBox.css("display","none");
                let index=$(this).index();
                detailRender.init(index);
            })
        }
    }
})();


let detailRender=(function () {
    let $detailBox=$(".detailBox"),
        $returnLink=$detailBox.find(".returnLink"),
        $cubeBox=$(".cubeBox"),
        $makisuBox=$("#makisuBox");
        swipeExample=null;


    let change=function (example) {
       // example.activeIndex//当前活动块的索引
        //example.slides//=>存储了当前所有活动块
        //example.slides[example.activeIndex]
        let {slides:slideAry,activeIndex}=example;
        //=>page1单独处理
        if(activeIndex===0){
            $makisuBox.makisu({
                select:"li",
                overlap:0.4,
                speed:0.8
            });
            $makisuBox.makisu("open")
        }else {
            $makisuBox.makisu({
                select:"li",
                overlap:0,
                speed:0
            });
            $makisuBox.makisu("close")
        }
        [].forEach.call(slideAry,(item,index)=>{
            if(index===activeIndex){
                item.id="page"+(activeIndex+1);
                return;
            }else {
                item.id=null;
            }
        })
    };


    return{
        init:function (index=0) {
            $detailBox.css("display","block");

            if(!swipeExample){              //不存在的情况下初始化存在的情况下就不需要初始化了
                swipeExample=new Swiper(".swiper-container",{
                    effect:"coverflow",
                    onTransitionEnd:change,
                    onInit:change
                    // loop:true,   如果我们采用的切换效果是3D的最好不要设置无缝衔接循环切换,再不分安卓机中,swiper这块的处理是有一些BUG;
                });
                $returnLink.tap(()=>{
                    $detailBox.css("display","none");
                    $cubeBox.css("display","block");
                });
            }
            index=index>5?5:index;
            swipeExample.slideTo(index,0)    //运动到指定索引的位置,第二个参数是speed,我们设置是让其立即远东到指定位置
            }

    }
})();
messageRender.init();
/*
 *基于swiper首先每一个页面的动画
 * 1,滑到某一个页面的时候,给当前页面设置一个ID,例如话都到第二个页面,我们给当期设置ID=page2
 * 2,当划出这个页面的时候,我们把之前设置的ID移除掉
 * 3,我们把当前页面中元素需要的动画效果全部写在指定的ID下
 *
 * 细节处理
 * 1,我们是基于animate.css帧动画库完成的动画
 * 2,我们让需要运动的元素初始样式是透明度为0(开始是隐藏的)
 * 3,当设置ID让其运动的时候,我们自己在动画公式完成的时候,让其为1
 */