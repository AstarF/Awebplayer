// JavaScript Document


function Aplayer(config) {

	this.musiclist = config.musiclist || []; //歌曲列表
	this.picturelist = config.picturelist || []; //图片列表
	this.currentpic = new Array(); //当前图片列表
	this.listlength = this.musiclist.length; //列表长度
	this.currentsong = null; //当前编号
	this.lastsong = 0; //上一曲编号
	this.playmode = 1;
	this.audios = null; //audios对象
	this.window = null;
	this.bgkey = 0; //背景改变开关
	this.lasttime = 0; //图片切换时间
	this.thememode= 1;//主题
	this.lyrictext=new Array();
	this.lyrictime=new Array();
	this.lyrici=0;
	this.songLyricAdd=null;
	this.init();
};
Aplayer.prototype = {
	config: {
		musiclist: [], //播放列表	
		picturelist: [],
	},

	//创建播放列表
	creatlist: function () {
		//alert("adc");

		var i = 0;
		var ul = '<ul>';
		for (i; i < this.listlength; i++) {
			ul += '<li class="songli">' + this.musiclist[i]['title'] + '</li>';
		}
		ul += '</ul>';

		// document.getElementById("list").innerHTML=ul;
		this.musicDom.songlists.innerHTML = ul;

	},
	//创建当前图片列表
	creatpic: function () {

		var i = 0;
		var curpic = this.picturelist[this.currentsong];
		for (var a in curpic) {
			this.currentpic[i] = curpic[a];
			i++;
		}
	},
	//销毁当前图片列表
	deletepic: function () {
		this.currentpic.splice(0, this.currentpic.length);
	},

	//设置相关函数
	funcop: function () {

		var me = this;
		var playlist = document.querySelectorAll('.songli');
		var musiclists = this.musiclist;

		//播放&&暂停
		this.buttonfunc.play.addEventListener('click', function () {
			if (me.audios.paused) {
				me.audios.play();
				switch(me.thememode){
					case 1:
						me.buttonfunc.play.className = "pause";
						break;
					case 2:
						me.buttonfunc.play.className = "pause pauseT2";
						break;
				}
			} else {
				me.audios.pause();
				switch(me.thememode){
					case 1:
						me.buttonfunc.play.className = "play";
						break;
					case 2:
						me.buttonfunc.play.className = "play playT2";
						break;
				}
			}

		});

		//上一首
		this.buttonfunc.last.addEventListener('click', function () {

			if (me.currentsong > 0) {
				me.currentsong = me.currentsong - 1;
				me.resetplayer(musiclists[me.currentsong]);
			} else {
				me.currentsong = me.listlength - 1;
				me.resetplayer(musiclists[me.currentsong]);
			}


		});
		//下一首
		this.buttonfunc.next.addEventListener('click', function () {
			if (me.currentsong < me.listlength - 1) {
				me.currentsong = me.currentsong + 1;
				me.resetplayer(musiclists[me.currentsong]);
			} else {
				me.currentsong = 0;
				me.resetplayer(musiclists[me.currentsong]);
			}
		});




		//设置播放模式
		this.buttonfunc.playmode.addEventListener('click', function () {

			if (me.playmode == 2) {
				me.playmode = 0;
			//	me.audios.loop = true;
				switch(me.thememode){
					case 1:
						me.buttonfunc.playmode.className = "playmode";
						break;
					case 2:
						me.buttonfunc.playmode.className = "playmode playmodeT2";
						break;
				}
			} else if (me.playmode == 0) {
				me.audios.loop = false;
				me.playmode = 1;
				switch(me.thememode){
					case 1:
						me.buttonfunc.playmode.className = "playmode playmode2";
						break;
					case 2:
						me.buttonfunc.playmode.className = "playmode playmode2 playmodeT2";
						break;
				}
			} else {
				me.audios.loop = false;
				me.playmode = 2;
				switch(me.thememode){
					case 1:
						me.buttonfunc.playmode.className = "playmode playmode3";
						break; 
					case 2:
						me.buttonfunc.playmode.className = "playmode playmode3 playmodeT2";
						break;
				}
			}
		});

		//音量调整版本1
		/*
		this.buttonfunc.voicebar.addEventListener('click', function (x) {

			if (x.target === me.buttonfunc.voicebarc) {

			} else {
				//   alert(x.offsetX);
				if (x.offsetX > 70) {
					me.buttonfunc.voicefill.style.width = '80px';
					me.buttonfunc.voicebarc.style.left = '72px';
				} else if (x.offsetX < 20) {
					me.buttonfunc.voicefill.style.width = '0px';
					me.buttonfunc.voicebarc.style.left = '0px';
				} else {
					me.buttonfunc.voicefill.style.width = x.offsetX - 3 + 'px';
					me.buttonfunc.voicebarc.style.left = x.offsetX - 7 + 'px';
				}
			}

		});

		var drag = 0;
		this.buttonfunc.voicebar.addEventListener('mousedown', function () {
			drag = 1;
		});
	     
		document.addEventListener('mouseup', function () {
			drag = 0;
		});
		
		this.buttonfunc.voicebar.addEventListener('mousemove',function(x){
			if(drag===1){
				    me.buttonfunc.voicefill.style.width = x.offsetX - 3 + 'px';
					me.buttonfunc.voicebarc.style.left = x.offsetX - 7 + 'px';
			}
		});
	   
        */


		//音量调整版本二
		this.buttonfunc.voicebar.addEventListener('input', function (e) {
			me.audios.volume = this.value;
			//me.voicebarfill(this.value);
		});

		//播放进度
		this.buttonfunc.mbar.addEventListener('input', function (e) {
			//me.buttonfunc.mbar.style.background = 'linear-gradient(to right, #059CFA, white ' + this.value + '%, white)';
			me.audios.currentTime = this.value;
			//me.mbarfill( me.audios.currentTime);
		});
		//重载进度条
		this.audios.addEventListener('canplay', function () {
			me.buttonfunc.mbar.max = me.audios.duration;
		});
		//进度条滚动
		this.audios.addEventListener('timeupdate', function () {

			me.buttonfunc.mbar.value = me.audios.currentTime;
			//me.mbarfill( me.audios.currentTime);
			var aTime = parseInt(me.audios.currentTime);
			var aLength = parseInt(me.audios.duration);
			me.buttonfunc.ctime.innerHTML = aTime + 's' + '/' + aLength + 's';
		});



		//顺序播放&&随机播放
		this.audios.addEventListener('ended', function () {
			if (me.playmode == 1) {
				if (me.currentsong < me.listlength - 1) {
					me.currentsong = me.currentsong + 1;
					me.resetplayer(musiclists[me.currentsong]);
				} else {
					me.currentsong = 0;
					me.resetplayer(musiclists[me.currentsong]);
				}
			}
			if (me.playmode == 2) {
				me.currentsong = parseInt(Math.random() * me.listlength);
				me.resetplayer(musiclists[me.currentsong]);
			}
			
			if(me.playmode == 0){
				me.resetplayer(musiclists[me.currentsong]);		
				me.lyric.innerHTML="";
				me.lyrici=0;
				
			}
		});

		//选择设置当前歌曲

		var i = 0;
		for (i; i < this.listlength; i++) {
			playlist[i].name = i;
			playlist[i].addEventListener('click', function () {
				me.currentsong = this.name;
				me.resetplayer(musiclists[this.name]);
				//alert(musiclists[this.name].src);
			});

		};
		/*
		//下拉菜单
		this.buttonfunc.listc.addEventListener('click',function(){
            me.buttonfunc.songlist.slideToggle();
        });
        */

		
	
		//主题改变
			this.themes.themeone.addEventListener('click',function(){					
				me.thememode=1;
				me.window.className="playerwin";
		        me.buttonfunc.changebg.innerHTML=""; 
				me.buttonfunc.changebg.className="changebg";
				me.buttonfunc.ctime.className="ctime";
				me.buttonfunc.mbar.className="mbar";
				me.buttonfunc.next.className="next";
				me.buttonfunc.play.className="play";
				me.buttonfunc.last.className="last";
				me.buttonfunc.playmode.className="playmode";
				me.buttonfunc.voicec.className="voice";
				me.buttonfunc.listc.className="listbutton";
				if(me.bgkey===1){
					me.buttonfunc.changebg.className="changebg changebg1";
				}else{
					me.buttonfunc.changebg.className="changebg";
				}
				
				me.buttonfunc.option.className="option";
				me.musicDom.sname.className="sname";
				
			});
			this.themes.themetwo.addEventListener('click',function(){
				me.thememode=2;
				me.window.className="playerwin playerwinT2";
				me.buttonfunc.changebg.innerHTML="斩";
				me.buttonfunc.changebg.className="changebg changebgT2";
				me.buttonfunc.ctime.className="ctime ctimeT2";
				me.buttonfunc.mbar.className="mbarT2";
				me.buttonfunc.next.className="next nextT2";
				me.buttonfunc.play.className="play playT2";
				me.buttonfunc.last.className="last lastT2";
				me.buttonfunc.playmode.className="playmode playmodeT2";
				me.buttonfunc.voicec.className="voice voiceT2";
				me.buttonfunc.listc.className="listbutton listbuttonT2";
				if(me.bgkey===1){
					me.buttonfunc.changebg.className="changebg changebgT2 changebg1 changebg1T2";
				}else{
					me.buttonfunc.changebg.className="changebg changebgT2";
				}
				me.buttonfunc.option.className="option optionT2";
				me.musicDom.sname.className="sname snameT2";
		
			});

		//背景切换
		this.buttonfunc.changebg.addEventListener('click', function () {
			if (me.bgkey === 0) {
				me.bgkey = 1;
				
				switch(me.thememode){
					case 1:
						me.buttonfunc.changebg.className = "changebg changebg1";
						break;
					case 2:
						me.buttonfunc.changebg.className = "changebg changebg1 changebgT2 changebg1T2";
						break;
				}
				me.bgdivss1.style.opacity=0.9;
				me.bgdivss1.style.display = "block";
			} else {
				me.bgkey = 0;
				switch(me.thememode){
					case 1:
						me.buttonfunc.changebg.className = "changebg";
						break;
					case 2:
						me.buttonfunc.changebg.className = "changebg changebgT2";
						break;
				}
				me.bgdiv1.className = "bgdiv";
				me.bgdivs1.className = "bgdivs";
				me.bgdiv1.style.display = "none";
				me.bgdivs1.style.display = "none";
				me.bgdivss1.style.opacity=0;
				setTimeout(function(){//一秒后执行
					me.bgdivss1.style.display = "none";			
				},1000);
			}

		});
		
		this.canchangebg.addEventListener('click', function () {
			if (me.bgkey === 0) {
				me.bgkey = 1;
				switch(me.thememode){
					case 1:
						me.buttonfunc.changebg.className = "changebg changebg1";
						break;
					case 2:
						me.buttonfunc.changebg.className = "changebg changebg1 changebgT2 changebg1T2";
						break;
				}
				me.bgdivss1.style.opacity=0.9;
				me.bgdivss1.style.display = "block";
			} else {
				me.bgkey = 0;
				switch(me.thememode){
					case 1:
						me.buttonfunc.changebg.className = "changebg";
						break;
					case 2:
						me.buttonfunc.changebg.className = "changebg changebgT2";
						break;
				}
				me.bgdiv1.className = "bgdiv";
				me.bgdivs1.className = "bgdivs";
				me.bgdiv1.style.display = "none";
				me.bgdivs1.style.display = "none";
				me.bgdivss1.style.opacity=0;
				setTimeout(function(){//一秒后执行
					me.bgdivss1.style.display = "none";			
				},1000);
			}

		});
        
		//歌词显示
		this.audios.addEventListener('timeupdate',function(){
				
			if(me.lyrictime[me.lyrici]==0)me.lyrici++;
			while(me.lyrictime[me.lyrici]<parseInt(me.audios.currentTime)){
				me.lyrici++;
			}
//			if(me.lasttime>me.audios.currentTime){
//				while(me.lyrictime[me.lyrici]>parseInt(me.audios.currentTime)){
//					me.lyrici--;
//				}
				
//			}
			//alert(parseInt(me.audios.currentTime));
			if(me.lyrictime[me.lyrici]===parseInt(me.audios.currentTime)){
		
				me.lyric.innerHTML=me.lyrictext[me.lyrici];
				me.lyrici++;
			}			
		});
        //播放时背景切换
		var m = 1;
		this.audios.addEventListener('timeupdate', function () {
			if (me.bgkey === 1) {
				if (me.lasttime === 0) {
					//me.randombg();
					me.lasttime = 0.1;

					//切换div和divs
					if (me.bgdiv1.name === 0) {
						me.bgdiv1.className = "bgdiv" + me.randombg();
						me.bgdiv.css({
							'background-image': 'url(' + me.currentpic[0] + ')'
						});

						me.bgdivs1.style.display = "none";
						me.bgdiv1.style.display = "block";

						me.bgdiv1.name = 1;
						me.bgdivs1.name = 0;
					} else {
						me.bgdivs1.className = "bgdivs" + me.randombg();
						me.bgdivs.css({
							'background-image': 'url(' + me.currentpic[0] + ')'
						});
						me.bgdiv1.style.display = "none";
						me.bgdivs1.style.display = "block";
						me.bgdivs1.name = 1;
						me.bgdiv1.name = 0;
					}
				}

				if (me.bgdiv1.style.display === "none" && me.bgdivs1.style.display === "none") {
					if (me.bgdiv1.name === 0) {
						me.bgdiv1.className = "bgdiv" + me.randombg();
						me.bgdiv.css({
							'background-image': 'url(' + me.currentpic[0] + ')'
						});

						me.bgdivs1.style.display = "none";
						me.bgdiv1.style.display = "block";

						me.bgdiv1.name = 1;
						me.bgdivs1.name = 0;
					} else {
						me.bgdivs1.className = "bgdivs" + me.randombg();
						me.bgdivs.css({
							'background-image': 'url(' + me.currentpic[0] + ')'
						});
						me.bgdiv1.style.display = "none";
						me.bgdivs1.style.display = "block";
						me.bgdivs1.name = 1;
						me.bgdiv1.name = 0;
					}
				}


				if (Math.abs(me.audios.currentTime - me.lasttime) > 30) {
					me.lasttime = me.audios.currentTime;
					

					if (m >= me.currentpic.length) {
						m = 0;
					}

					//切换div和divs
					if (me.bgdiv1.name === 0) {
						me.bgdiv1.className = "bgdiv" + me.randombg();
						me.bgdiv.css({
							'background-image': 'url(' + me.currentpic[m] + ')'
						});
						me.bgdivs1.style.display = "none";
						me.bgdiv1.style.display = "block";
						me.bgdiv1.name = 1;
						me.bgdivs1.name = 0;
					} else {
						me.bgdivs1.className = "bgdivs" + me.randombg();
						me.bgdivs.css({
							'background-image': 'url(' + me.currentpic[m] + ')'
						});
						me.bgdiv1.style.display = "none";
						me.bgdivs1.style.display = "block";
						me.bgdivs1.name = 1;
						me.bgdiv1.name = 0;
					}
					m++;
				}
				if (me.lasttime === 0) {
					m = 0;
				}
			}
			
			
			


		});

	},

	//进度条填充
	mbarfill: function (ctime) {
		if (this.audios.duration > 100) {
			this.buttonfunc.mbar.style.background = 'linear-gradient(to right, #059CFA, white ' + ctime + '%, white)';
		} else if (this.audios.duration > 100) {
			this.buttonfunc.mbar.style.background = 'linear-gradient(to right, #059CFA, white ' + ctime * 4 + '%, white)';
		} else if (this.audios.duration > 50) {
			this.buttonfunc.mbar.style.background = 'linear-gradient(to right, #059CFA, white ' + ctime * 8 + '%, white)';
		} else {
			this.buttonfunc.mbar.style.background = 'linear-gradient(to right, #059CFA, white ' + ctime * 16 + '%, white)';
		}

	},
	
	
	Loadlyric:function(){
		var me = this;
		//alert($(".lyrictemp").text());
		this.lyrictemp.load(this.songLyricAdd,function(){
		var lyric = $(".lyrictemp").text();
			
		var one = new Array();
		one = lyric.split("[");
		var two = new Array();//lyric
		var three=new Array();
		var four=new Array();//time second
		var temp=new Array();
       for(var i=1;i<one.length;i++){
		   temp=one[i].split("]");
		   two[i-1]=temp[1];
		   three[i-1]=temp[0];
	   }
	   for(var i=0;i<three.length;i++){
		   three[i]=three[i].substr(0,5);
		   temp = three[i].split(":");
		   four[i]=parseFloat(temp[0])*60+parseFloat(temp[1]);
	    }
//       $("#ss2").text(four[6]);
			
		me.lyrictext=two;
		me.lyrictime=four;
		//	alert(me.lyrictext[me.lyrici]);
	  });

	},

	//背景切换随机模式
	randombg: function () {
		var i = parseInt(Math.random() * 10);
		var a;
		switch (i) {
			case 0:
				a = " bgdiv1";
				break;
			case 1:
				a = " bgdiv2";
				break;
			case 2:
				a = " bgdiv3";
				break;
			case 3:
				a = " bgdiv4";
				break;
			case 4:
				a = " bgdiv5";
				break;
			case 5:
				a = " bgdiv6";
				break;
			case 6:
				a = " bgdiv7";
				break;
			case 7:
				a = " bgdiv8";
				break;
			case 8:
				a = " bgdiv9";
				break;
			case 9:
				a = " bgdiv10";
				break;
			case 10:
				a = " bgdiv1";
				break;
		}
		return a;
	},
	
	
	
    //显示歌名
	songinformation:function(){
	     	
	},

	resetplayer: function (song) {
		var playlist = document.querySelectorAll('.songli');
		this.audios.load();
		//alert(songsrc);
		this.audios.src = song.src;
		this.songLyricAdd=song.lyric;
		this.audios.play();
		//document.getElementById("csongname").innerHTML=song.title;
		//document.getElementById("csinger").innerHTML=song.singer;
		this.musicDom.sname.innerHTML = song.title;
		//this.musicDom.csinger.innerHTML=song.singer;
		playlist[this.lastsong].className = "songli";
		playlist[this.currentsong].className = "songli songcu";
		this.lastsong = this.currentsong;
	    switch(this.thememode){
			case 1:
				this.buttonfunc.play.className = "pause";
					break;
			case 2:
				this.buttonfunc.play.className = "pause playT2";
						break;
		}
		this.lasttime = 0;
		this.lyrici=0;
		this.Loadlyric();
		this.lyric.innerHTML="";
		this.deletepic();
		this.creatpic();
	},



	createpwin: function () {
		this.window.className = "playerwin";
		var playc = document.createElement("div");
		playc.className = "play";
		var listc = document.createElement("div");
		listc.className = "listbutton";
		var lists = document.createElement("div");
		lists.className = "songlist";
		var lastc = document.createElement("div");
		lastc.className = "last";
		var nextc = document.createElement("div");
		nextc.className = "next";
		var modec = document.createElement("div");
		modec.className = "playmode playmode2";
		var voicec = document.createElement("div");
		voicec.className = "voice";
		var voicebar = document.createElement("input");
		voicebar.className = "voicebar";
		voicebar.type = "range";
		voicebar.value = 1;
		voicebar.max = 1;
		voicebar.min = 0;
		voicebar.step = 0.1;
		//var voicebarc = document.createElement("div");
		//voicebarc.className = "voicebarc";
		//var voicefill = document.createElement("div");
		//voicefill.className = "voicefill";
		var mbar = document.createElement("input");
		mbar.className = "mbar";
		mbar.type = "range";
		mbar.value = 0;
		mbar.max = 100;
		mbar.min = 0;
		mbar.step = 1;
		var ctime = document.createElement("div");
		ctime.className = "ctime";
		ctime.innerHTML = '0s/0s';
		var sname = document.createElement("div");
		sname.className = "sname";
		var changebg = document.createElement("div");
		changebg.className = "changebg";
		var bgdiv = document.createElement("div");
		bgdiv.className = "bgdiv";
		bgdiv.name = 0;
		var bgdivs = document.createElement("div");
		bgdivs.className = "bgdivs";
		bgdivs.name = 0;
		var bgdivss = document.createElement("div");
		bgdivss.className = "bgdivss";
		var Aoption = document.createElement("div");
		Aoption.className="option";
		var optionlist=document.createElement("div");
		optionlist.className="optionlist";
		var theme=document.createElement("div");
		theme.className="options theme";
		theme.innerHTML="主题";
		
		var themelist=document.createElement("div");
		themelist.className="themelist";
		var themeone=document.createElement("div");
		themeone.className="themes themeone";
		themeone.innerHTML="微光";
		var themetwo=document.createElement("div");
		themetwo.className="themes themetwo";
		themetwo.innerHTML="黑瞳";
		
		var lyrictemp = document.createElement("div");
		lyrictemp.className = "lyrictemp";
		//lyrictemp.style.display="none";
		
		var lyric = document.createElement("div");
		lyric.className = "lyric";

	
		
		
		var canchangebg=document.createElement("div");
		canchangebg.className="options canchangebg";
		canchangebg.innerHTML="动态背景";
		this.window.appendChild(listc);
		this.window.appendChild(lastc);
		this.window.appendChild(playc);
		this.window.appendChild(nextc);
		this.window.appendChild(modec);
		this.window.appendChild(voicec);
		voicec.appendChild(voicebar);
		//voicebar.appendChild(voicefill);
		//voicebar.appendChild(voicebarc);
		listc.appendChild(lists);
		this.window.appendChild(mbar);
		this.window.appendChild(ctime);
		this.window.appendChild(sname);
		this.window.appendChild(changebg);
		document.body.appendChild(bgdivss);
		document.body.appendChild(bgdiv);
		document.body.appendChild(bgdivs);
		this.window.appendChild(Aoption);
		Aoption.appendChild(optionlist);
		optionlist.appendChild(theme);
		optionlist.appendChild(canchangebg);
		theme.appendChild(themelist);
		themelist.appendChild(themeone);
		themelist.appendChild(themetwo);
        document.body.appendChild(lyrictemp);
		document.body.appendChild(lyric);
	},

	someselect: function () {
		this.musicDom = {
			//cname: $("#csongname")[0],
			//currentif:$(".current")[0],
			/* $('#divid')是jQuery对象，没有innerHTML属性   
			innerHTML是原生对象的属性  
			加上[0]把jQuery对象转换为原生对象*/

			//csinger: $("#csinger")[0],
			songlists: $(".songlist")[0],
			sname: $(".sname")[0],
		};

		this.buttonfunc = {
			listc: $(".listbutton")[0],
			play: $(".play")[0],
			last: $(".last")[0],
			next: $(".next")[0],
			playmode: $(".playmode")[0],
			voicec: $(".voice")[0],
			voicebar: $(".voicebar")[0],
			//voicebarc: $(".voicebarc")[0],
			//voicefill: $(".voicefill")[0],
			mbar: $(".mbar")[0],
			ctime: $(".ctime")[0],
			songlist: $(".songlist"),
			changebg: $(".changebg")[0],
			option:$(".option")[0],
		};
		this.bgdiv = $(".bgdiv");
		this.bgdiv1 = $(".bgdiv")[0];
		this.bgdivs = $(".bgdivs");
		this.bgdivs1 = $(".bgdivs")[0];
		this.bgdivss1 = $(".bgdivss")[0];
		this.canchangebg = $(".canchangebg")[0];
		this.lyrictemp = $(".lyrictemp");
		this.lyric = $(".lyric")[0];
		this.themes={
			themeone:$(".themeone")[0],
			themetwo:$(".themetwo")[0],
		};
		
		//this.playerwin=$(".playerwin")[0];
		//this.pagebody=$("body")[0];
	},


	/*
	        changeccss:function(){
				  this.musicDom.currentif.className="currenting";
			},
	*/
	init: function () {


		this.audios = document.createElement("audio");
		this.window = document.createElement("div");
		document.body.appendChild(this.window);
		this.createpwin();
		this.someselect();
		this.creatlist();
		//this.audios.loop = true;
		this.audios.volume = 1;
		//this.buttonfunc.voicebar.style.background = 'linear-gradient(to right, #059CFA, white 100%, white)';
		this.funcop();
		//this.resetplayer(this.musiclist[this.currentsong]);
		//this.playerwin.draggable();有错误
	},
};


$(function () { //文档加载完毕执行
		$(".playerwin").draggable();
	
});




