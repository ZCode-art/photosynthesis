var game = document.getElementById("game");
game.style.display = "none";
var playerscount = 0; //玩家数
var imgarray = []; //玩家头像
var player_divs = []; //玩家div界面
var current_player_index = 0;//当前玩家index
var photosynthesistimes = 0;
var times_inaround = 0; //本回合
var suns_inaround = 0;
var round_count = 0;
var sunshine_values = []; //阳光值
var harvest_scores = []; //收割大树得分
var lastclickeddiv = null;
var affecteddivs = [];
var oneturn = function(){};
var endturn = function(){};
var colors = ["red", "yellow", "blue", "green"];
var sun_angles = [180, -120, -60, 0, 60, 120];
//记录森林种树情况
var forest = {
    "one":['','','','','','','','','','','','','','','','','',''],
    "two":['','','','','','','','','','','',''],
    "three":['','','','','',''],
    "four":['']
};
//森林每回只能操作一次
var forest_untouch = {
    "one":[true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],
    "two":[true,true,true,true,true,true,true,true,true,true,true,true],
    "three":[true,true,true,true,true,true],
    "four":[true]
};
//收割大树得分记录
var score_record = {
    "one":[12,12,13,13,13,14],
    "two":[13,14,14,/**/14,16,17],
    "three":[13,14,15,16,17,/**/18,19],
    "four":[17,18,19,20,/**/21,22]
};

const sunshine_calculator = [
    { //0->180deg
        "one":[['','',''],['','',''],['','',''],
               ['','',''],['one-3','',''],['one-4','one-3',''],
               ['one-5','one-4','one-3'],['two-4','two-3','two-2'],['two-5','three-2','three-1'],
               ['two-6','three-3','four-0'],['two-7','three-4','three-5'],['two-8','two-9','two-10'],
               ['one-13','one-14','one-15'],['one-14','one-15',''],['one-15','',''],
               ['','',''],['','',''],['','','']],
        "two":[['one-0','',''],['one-1','',''],['one-2','',''],
               ['two-2','one-2',''],['two-3','two-2','one-2'],['three-2','three-1','two-1'],
               ['three-3','four-0','three-0'],['three-4','three-5','two-11'],['two-9','two-10','one-16'],
               ['two-10','one-16',''],['one-16','',''],['one-17','','']],
        "three":[['two-0','one-0',''],['two-1','one-1',''],['three-1','two-1','one-1'],
                 ['four-0','three-0','two-0'],['three-5','two-11','one-17'],['two-11','one-17','']],
        "four": [['three-0','two-0','one-0']]
    },
    { //1->-120deg
        "one":[['','',''],['one-0','',''],['one-1','one-0',''],
               ['one-2','one-1','one-0'],['two-2','two-1','two-0'],['two-3','three-1','three-0'],
               ['two-4','three-2','four-0'],['two-5','three-3','three-4'],['two-6','two-7','two-8'],
               ['one-10','one-11','one-12'],['one-11','one-12',''],['one-12','',''],
               ['','',''],['','',''],['','',''],
               ['','',''],['','',''],['','','']],
        "two":[['one-17','',''],['two-0','one-17',''],['two-1','two-0','one-17'],
               ['three-1','three-0','two-11'],['three-2','four-0','three-5'],['three-3','three-4','two-9'],
               ['two-7','two-8','one-13'],['two-8','one-13',''],['one-13','',''],
               ['one-14','',''],['one-15','',''],['one-16','','']],
        "three":[['two-11','one-16',''],['three-0','two-11','one-16'],
                 ['four-0','three-5','two-10'],['three-4','two-9','one-14'],['two-9','one-14',''],['two-10','one-15','']],
        "four": [['three-5','two-10','one-15']]
    },
    { //2->-60deg
        "one":[['one-17','one-16','one-15'],['two-0','two-11','two-10'],['two-1','three-0','three-5'],
               ['two-2','three-1','four-0'],['two-3','three-2','three-3'],['two-4','two-5','two-6'],
               ['one-7','one-8','one-9'],['one-8','one-9',''],['one-9','',''],
               ['','',''],['','',''],['','',''],
               ['','',''],['','',''],['','',''],
               ['','',''],['one-15','',''],['one-16','one-15','']],
        "two":[['two-11','two-10','two-14'],['three-0','three-5','two-9'],['three-1','four-0','three-4'],
               ['three-2','three-3','two-7'],['two-5','two-6','two-10'],['two-6','one-10',''],
               ['one-10','',''],['one-11','',''],['one-12','',''],
               ['one-13','',''],['one-14','',''],['two-10','one-14','']],
        "three":[['three-5','two-9','one-13'],['four-0','three-4','two-8'],['three-3','two-7','one-11'],
                 ['two-7','one-11',''],['two-8','one-12',''],['two-9','one-13','']],
        "four": [['three-4','two-8','one-12']]
    },
    { //3->0deg
        "one":[['two-0','three-0','four-0'],['two-1','three-1','three-2'],['two-2','two-3','two-4'],
               ['one-4','one-5','one-6'],['one-5','one-6',''],['one-6','',''],
               ['','',''],['','',''],['','',''],
               ['','',''],['','',''],['','',''],
               ['','',''],['one-12','',''],['one-13','one-12',''],
               ['one-14','one-13','one-12'],['two-10','two-9','two-8'],['two-11','three-5','three-4']],
        "two":[['three-0','four-0','three-3'],['three-1','three-2','two-5'],['two-3','two-4','one-7'],
               ['two-4','one-7',''],['one-7','',''],['one-8','',''],
               ['one-9','',''],['one-10','',''],['one-11','',''],
               ['two-8','one-11',''],['two-9','two-8','one-11'],['three-5','three-4','two-7']],
        "three":[['four-0','three-3','two-6'],['three-2','two-5','one-8'],['two-5','one-8',''],
                 ['two-6','one-9',''],['two-7','one-10',''],['three-4','two-7','one-10']],
        "four": [['three-3','two-6','one-9']]
    },
    { //4->60deg
        "one":[['one-1','one-2','one-3'],['one-2','one-3',''],['one-3','',''],
               ['','',''],['','',''],['','',''],
               ['','',''],['','',''],['','',''],
               ['','',''],['one-9','',''],['one-10','one-9',''],
               ['one-11','one-10','one-9'],['two-8','two-7','two-6'],['two-9','three-4','three-3'],
               ['two-10','three-5','four-0'],['two-11','three-0','three-1'],['two-0','two-1','two-2']],
        "two":[['two-1','two-2','one-4'],['two-2','one-4',''],['one-4','',''],
               ['one-5','',''],['one-6','',''],['one-7','',''],
               ['one-8','',''],['two-6','one-8',''],['two-7','two-6','one-8'],
               ['three-4','three-3','two-5'],['three-5','four-0','three-2'],['three-0','three-1','two-3']],
        "three":[['three-1','two-3','one-5'],['two-3','one-5',''],['two-4','one-6',''],
                 ['two-5','one-7',''],['three-3','two-5','one-7'],['four-0','three-2','two-4']],
        "four": [['three-2','two-4','one-6']]
    },
    { //5->120deg
        "one":[['','',''],['','',''],['','',''],
               ['','',''],['','',''],['','',''],
               ['','',''],['one-6','',''],['one-7','one-6',''],
               ['one-8','one-7','one-6'],['two-6','two-5','two-4'],['two-7','three-3','three-2'],
               ['two-8','three-4','four-0'],['two-9','three-5','three-0'],['two-10','two-11','two-0'],
               ['one-16','one-17','one-0'],['one-17','one-0',''],['one-0','','']],
        "two":[['one-1','',''],['one-2','',''],['one-3','',''],
               ['one-4','',''],['one-5','',''],['two-4','one-5',''],
               ['two-5','two-4','one-5'],['three-3','three-2','two-3'],['three-4','four-0','three-1'],
               ['three-5','three-0','two-1'],['two-11','two-0','one-1'],['two-0','one-1','']],
        "three":[['two-1','one-2',''],['two-2','one-3',''],['two-3','one-4',''],
                 ['three-2','two-3','one-4'],['four-0','three-1','two-2'],['three-0','two-1','one-2']],
        "four": [['three-1','two-2','one-3']]
    },

];
var smtreediv = null; //开始阶段种小树
var unlocktreediv = null; //解锁
var upgradetreediv = null;//升级
var seeddiv = null; //种子
var choosedavatars = new Set();
var avatars = document.getElementsByClassName("avatars")[0].getElementsByTagName("img");

function onclickavatar(index){
    if(choosedavatars.has(index)){
        choosedavatars.delete(index);
        let avatar = avatars[index];
        if(avatar){
            avatar.style.border = "none";
        }
        
    }
    else{
        choosedavatars.add(index);
        let avatar = avatars[index];
        if(avatar){
            avatar.style.border = "1vh solid green";
        }
    }
}
function onclickbegin(){
    playerscount = choosedavatars.size;
    if(playerscount < 2 || playerscount > 4){
        return;
    }
    //打乱顺序
    let choosedIndexs = Array.from(choosedavatars);
    choosedIndexs.sort(function(){ return 0.5 - Math.random() });
    //let imgarray = []; //头像img
    choosedIndexs.forEach(index => {
        imgarray.push(avatars[index]);
    });
    //let colors = ["red", "yellow", "blue", "green"];
    let orderavatars = document.getElementsByClassName("order-avatars")[0].getElementsByTagName("div");
    for (let i = 0; i < imgarray.length; i++) {
        const img = imgarray [i];
        img.style.border = "1vh solid " + colors[i];
        orderavatars[i].appendChild(img);
    }
    window.setTimeout(function(){
        let beforegame = document.getElementById("beforegame");
        beforegame.style.display = "none";
        // game.style.visibility = "visible";
        game.style.display = "flex";
        gamemain();
    },1000);
    
}
function setinterface(){
    //隐藏光合作用界面
    showphotosynthesisinterface(false);
    //阳光照射
    setsunangles(sun_angles[0]);
    //隐藏多余的玩家界面
    console.log("playerscount:"+playerscount);
    for (let i = playerscount; i < 4; i++) {
        let classname = "player" + i;
        //console.log(classname);
        let div = document.getElementsByClassName(classname)[0];
        div.style.display = "none";
    }
    //let colors = ["red", "yellow", "blue", "green"];
    let tableimgdivs = document.getElementsByClassName("photosynthesis")[0].getElementsByClassName("tablediv");
    //设置玩家头像，可见性，树颜色
    for (let i = 0; i < playerscount; i++) {
        let classname = "player" + i;
        let div = document.getElementsByClassName(classname)[0];
        let imgdiv = div.getElementsByClassName("user-info")[0].getElementsByTagName("div")[0];
        //玩家界面头像
        imgdiv.appendChild(imgarray[i]);
        //光合作用界面头像
        tableimgdivs[i].appendChild(imgarray[i].cloneNode(true));
        //可见性
        //div.style.display = (i==0)?"block":"none";
        //先全部不可见
        div.style.display = "none";
        //阳光值初始化为0
        sunshine_values.push(0);
        harvest_scores.push(0);
        //颜色
        let treenames = ["seed", "smalltree", "mediumtree", "bigtree"];
        for (let j = 0; j < treenames.length; j++) {
            let treename = treenames[j];
            let treenamedivs = div.getElementsByClassName(treename);
            //console.log(treenamedivs.length);
            let bgistyle = "url(img/" + treenames[j] + "-" + colors[i] +".png)";
            //console.log(bgistyle);
            for (let k = 0; k < treenamedivs.length; k++) {
                let treenamediv = treenamedivs[k];
                treenamediv.style.backgroundImage = bgistyle;
            }
        }
        player_divs.push(div);
    }
}
//重新设置forest_untouch，表示本轮还未使用过该位置
function untouchforest(){
    for (key in forest_untouch){
        //console.log("key:" + key);
        for (let i = 0; i < forest_untouch[key].length; i++) {
            forest_untouch[key][i] = true; 
        }
    }
}
//界面更新阳光值
function updatesunshine(){
    let playerdiv = player_divs[current_player_index];
    playerdiv.getElementsByTagName("b")[0].innerText = "" + sunshine_values[current_player_index];
}
//界面更新得分
function updateharvestscore(){
    let playerdiv = player_divs[current_player_index];
    playerdiv.getElementsByTagName("b")[1].innerText = "" + harvest_scores[current_player_index];
}
function callfunctionbytimes(func, endfunc, times){
    photosynthesistimes = times;
    times_inaround = 0;
    oneturn = func;
    endturn = endfunc;
    changeinterface(0);
}
//废弃吧，不想再setTimeout了
// function plantinturn(oneturnfunction, conditionwaitfunction){
//     times_inaround = 0;
//     oneturn = oneturnfunction;
//     changeinterface(0);
//     setTimeout(conditionwaitfunction,1000);
// }
//切换玩家界面
function changeinterface(iplayer){
    if(iplayer < 0 || iplayer >= playerscount){
        return;
    }
    for (let i = 0; i < playerscount; i++) {
        let playerdiv = player_divs[i];
        // playerdiv.style.visibility = (i==iplayer)?"visible":"hidden";
        if(i == iplayer){
            playerdiv.style.display = "block";
            current_player_index = i;
            updatesunshine();
            untouchforest();
            clearlastclick();
        }
        else{
            playerdiv.style.display = "none";
        }
    }
    oneturn();
    ++times_inaround;
    console.log("changeinterface after ++times_inaround,times_inaround:" +times_inaround);
    if(times_inaround == photosynthesistimes){
        oneturn = function(){};
    }
    else if(times_inaround > photosynthesistimes){
        endturn();
    }
}
//解锁区点击种子后，点播种按钮
function plantseedclick(e, div){
    seeddiv = div.parentNode;
    div.parentNode.removeChild(div);

    //森林可播种位置显示按钮
    let classnamearray = findseedplantpos();
    //显示播种
    let appdiv = document.getElementById("app");
    for (let i = 0; i < classnamearray.length; i++) {
        let classname = classnamearray[i];
        let heart = appdiv.getElementsByClassName(classname)[0];
        //heart.innerHTML = "<button onclick='plantseedhereclick(event,this)'>播种</button>";
        let btn = document.createElement("BUTTON");
        btn.innerText = "播种";
        btn.onclick = function(){
            plantseedhereclick(event, this);
        };
        heart.appendChild(btn);
    }
    e.stopPropagation(); 

}
//森林大树收割
function harvestbigtreeclick(e, div){
    let heart = div.parentNode;
    //div.parentNode.removeChild(div);
    //heart.style.border = "1px solid #000";
    clearlastclick();

    let [numstr, index] = heart.className.split('-');//比如one-0
    //let [playerindex, tree] = forest[numstr][index].split('-');//比如0-smalltree
    let treediv = heart.getElementsByTagName("div")[0];
    //放入未解锁区
    let unfreetree_div = player_divs[current_player_index].getElementsByClassName("unfree-tree")[0];
    let treedivs = unfreetree_div.getElementsByClassName("bigtree");
    let treelength = treedivs.length;
    let treematdivs = unfreetree_div.getElementsByClassName("bigtree-mat");
    treematdivs[treelength].appendChild(treediv);
    //添加功能
    let svaluearray = [5,4];
    let svalue = svaluearray[treelength];
    treediv.onclick = getunfreeclickfunction(svalue);
    //取消之前最后一个的功能
    if(treelength > 0){
        treedivs[treelength-1].onclick = null;
    }

    //其他工作，更新sunshine_values、forest、forest_untouch
    sunshine_values[current_player_index] -= 4;
    updatesunshine();
    let score = score_record[numstr].pop();
    if(!score){ //为空，该类得分已用完
        let next = {
            "four":"three",
            "three":"two",
            "two" :"one"
        }
        let numstrcopy = numstr;
        while(!score){
            numstrcopy = next[numstrcopy];
            if(numstrcopy){
                score = score_record[numstrcopy].pop();
            }
            else{
                score = 0;
                break;
            }
        }
    }
    harvest_scores[current_player_index] += score;
    updateharvestscore();
    //显示
    forest[numstr][index] = "";
    forest_untouch[numstr][index] = false;
}
//森林里点击升级树
function upgrateclick(e, div){
    let heart = div.parentNode;
    div.parentNode.removeChild(div);

    //升级前的树的信息
    let [numstr, index] = heart.className.split('-');//比如one-0
    let [playerindex, tree] = forest[numstr][index].split('-');//比如0-smalltree

    //let treediv = heart.getElementsByTagName("div")[0];
    let treediv = heart.children[0];
    
    if(!upgradetreediv){
        //为空，说明从森林中点击，需要选择一个升级后的树
        // let treenames = ["seed", "smalltree", "mediumtree", "bigtree"];
        // for (; idx < treenames.length-1; idx++) {
        //     if(tree == treenames[idx]){
        //         break;
        //     }
        // }
        // let targetname = treenames[idx+1];
        let next = {
            "seed" : "smalltree",
            "smalltree" : "mediumtree",
            "mediumtree" : "bigtree"
        }
        let targetname = next[tree];
        let freetree_div = player_divs[current_player_index].getElementsByClassName("free-tree")[0];
        let targetdivs = freetree_div.getElementsByClassName(targetname);
        if(targetdivs.length > 0){
            upgradetreediv = targetdivs[0];
        }
    }
    else{
        upgradetreediv.parentNode.style.border = "none";
        //upgradetreediv.hasclicked = false;
        //upgradetreediv.parentNode.parentNode.hasclicked = false;
    }
    if(!upgradetreediv){
        console.log("bug: upgradetreediv is null!");
        return;
    }
    //升级前的树tree需要放入未解锁区，如未解锁区已满，放入已丢弃区
    let unfreetree2num = {
        "seed" : 4,
        "smalltree" : 4,
        "mediumtree" : 3,
        "bigtree" : 2
    }
    let unfreetree_div = player_divs[current_player_index].getElementsByClassName("unfree-tree")[0];
    let treedivs = unfreetree_div.getElementsByClassName(tree);
    let treelength = treedivs.length;
    clearlastclick();
    if(treelength < unfreetree2num[tree]){
        //可以放入未解锁区
        let treematdivs = unfreetree_div.getElementsByClassName(tree+"-mat");
        treematdivs[treelength].appendChild(treediv);
        //添加功能
        let sun = {
            "seed" : [2,2,1,1],
            "smalltree" : [3,3,2,2],
            "mediumtree" : [4,3,3],
            "bigtree" : [5,4]
        }
        let svalue = sun[tree][treelength];
        treediv.onclick = getunfreeclickfunction(svalue);
        //取消之前最后一个的功能
        if(treelength > 0){
            treedivs[treelength-1].onclick = null;
        }
    }
    else{
        //丢弃
        let lostdiv = player_divs[current_player_index].getElementsByClassName("lost")[0];
        let div = document.createElement("DIV");
        div.appendChild(treediv);
        lostdiv.appendChild(div);
        treediv.onclick = null;
    }
    //清除显示
    //showbyclassname(false, findownpos(tree));
    //放入升级后的树
    heart.appendChild(upgradetreediv);
    upgradetreediv.onclick = foresttreeclick;
    //其他工作，更新sunshine_values、forest、forest_untouch
    let upgradecost = {
        "seed" : 1,
        "smalltree" : 2,
        "mediumtree" : 3
    }
    sunshine_values[current_player_index] -= upgradecost[tree];
    updatesunshine();
    forest[numstr][index] = current_player_index + "-" + upgradetreediv.className;
    forest_untouch[numstr][index] = false;
    upgradetreediv = null;
    e.stopPropagation();
}
//解锁区点击升级树，点击之后，森林里目标树出现按钮
function upgradetreeclick(e, div){
    //console.log("upgradetreeclick div:",div);
    upgradetreediv = div.parentNode;
    div.parentNode.removeChild(div);

    let treenames = ["seed", "smalltree", "mediumtree", "bigtree"];
    let idx = 1;
    for (; idx < treenames.length; idx++) {
        if(upgradetreediv.className == treenames[idx]){
            break;
        }
    }
    let classnamearray = findownpos(treenames[idx-1]);
    //console.log("upgradetreeclick treenames[i-1]:"+treenames[idx-1]);

    //显示升级
    let appdiv = document.getElementById("app");
    for (let i = 0; i < classnamearray.length; i++) {
        let classname = classnamearray[i];
        let heart = appdiv.getElementsByClassName(classname)[0];
        //heart.innerHTML = "<button onclick='upgrateclick(event,this)'>升级</button>";
        let btn = document.createElement("BUTTON");
            btn.innerText = "升级";
            btn.onclick = function(){
                upgrateclick(event, this);
            };
            heart.appendChild(btn);
    }
    e.stopPropagation();    
}
//点击解锁按钮
function unlockclick(e, div){
    //console.log("unlockclick div.parentNode:", div.parentNode);
    //console.log("unlockclick unlocktreediv:", unlocktreediv);
    unlocktreediv.parentNode.style.border = "none";
    //unlocktreediv.hasclicked = false;
    //unlocktreediv.innerHTML = "";
    clearlastclick();
    let treename = unlocktreediv.className;

    let freetree_div = player_divs[current_player_index].getElementsByClassName("free-tree")[0];
    let matname = treename + "-mat";
    let treematdivs = freetree_div.getElementsByClassName(matname);
    //console.log("unlockclick treematdivs.length:"+treematdivs.length);
    for (let i = 0; i < treematdivs.length; i++) {
        let treematdiv = treematdivs[i];
        let treediv = treematdiv.getElementsByClassName(treename);
        //console.log("unlockclick treediv:",treediv);
        if(treediv.length == 0){
            //可以放入
            treematdiv.appendChild(unlocktreediv);
            sunshine_values[current_player_index] -= unlocktreediv.sunvalue;
            updatesunshine();
            //console.log("unlocktreediv.sunvalue:"+unlocktreediv.sunvalue);
            if(treename == "seed"){
                unlocktreediv.onclick = seedclick;
                //console.log("unlockclick unlocktreediv:",unlocktreediv);
            }
            else{
                unlocktreediv.onclick = function(){
                    (gettreeclickfunction(treename))();
                }
            }
            break;
        }
    }
    //未解锁区
    let unfreetree_div = player_divs[current_player_index].getElementsByClassName("unfree-tree")[0];
    let treenamedivs = unfreetree_div.getElementsByClassName(treename);
    let lastindex = treenamedivs.length-1;
    if(lastindex >= 0){
        //给最后一个添加
        let lasttreenamediv = treenamedivs[lastindex];
        let sun = {
            "seed" : [2,2,1,1],
            "smalltree" : [3,3,2,2],
            "mediumtree" : [4,3,3],
            "bigtree" : [5,4]
        }
        let svalue = sun[treename][lastindex];
        lasttreenamediv.onclick = getunfreeclickfunction(svalue);
    }
    
    unlocktreediv = null;
    e.stopPropagation();
}
//解锁区种小树，点击种树按钮，需要显示种这
function plantclick(e, div){
    //console.log("button click");
    //暂时记录种哪颗树
    smtreediv = div.parentNode;
    div.parentNode.removeChild(div);
    //console.log("smtreediv:",smtreediv);
    //显示种这
    let hearts = document.getElementById("app").getElementsByTagName("div");
    for (let h = 0; h < hearts.length; h++) {
        let heart = hearts[h];
        if(heart.className.startsWith('one')){
            let index = heart.className.split("-")[1];
            if(forest["one"][index] == ""){
                //heart.innerHTML = "<button onclick='planthereclick(event,this)'>种这</button>";
                let btn = document.createElement("BUTTON");
                btn.innerText = "种这";
                btn.onclick = function(){
                    planthereclick(event, this);
                };
                heart.appendChild(btn);
            }
            
        }
    } 
    e.stopPropagation();       
}
//森林小树种这
function planthereclick(e, div){
    let heart = div.parentNode;
    showoneplant(false);
    //console.log("smtreediv:",smtreediv);
    //smtreediv.parentNode.style.border = "none";
    //smtreediv.hasclicked = false;
    //smtreediv.parentNode.parentNode.hasclicked = false;
    clearlastclick();
    heart.appendChild(smtreediv);
    //记录森林
    let [heartindex, index] = heart.className.split("-");
    //console.log("heart.className:"+heart.className); 
    let treename = smtreediv.className;
    //记录格式 0-samlltree
    forest[heartindex][index] = current_player_index + "-" + treename;
    //console.log("heartindex:"+heartindex+",index:"+index+",forest[heartindex][index]:"+forest[heartindex][index]); 
    //本轮暂时禁用
    forest_untouch[heartindex][index] = false;
    //添加新的click函数
    smtreediv.onclick = foresttreeclick;
    smtreediv = null;
    //立刻结束回合
    endround(current_player_index);
    e.stopPropagation();
}
//森林种子种这
function plantseedhereclick(e, div){
    //console.log("plantseedhereclick div:",div);
    let heart = div.parentNode;
    //设置显示
    //seeddiv.parentNode.style.border = "none";
    //seeddiv.hasclicked = false;
    //seeddiv.parentNode.parentNode.hasclicked = false;
    clearlastclick();
    heart.appendChild(seeddiv);
    //let classnamearray = findseedplantpos();
    //showbyclassname(false, classnamearray);
    //记录森林
    let [heartindex, index] = heart.className.split("-");
    let treename = seeddiv.className;
    //记录格式 0-samlltree
    forest[heartindex][index] = current_player_index + "-" + treename;
    //本轮暂时禁用
    forest_untouch[heartindex][index] = false;
    //更新阳光值
    sunshine_values[current_player_index] -= 1;
    updatesunshine();
    //添加新的click函数
    seeddiv.onclick = foresttreeclick;
    seeddiv = null;

    e.stopPropagation();
}
//森林中各种树点击事件
function foresttreeclick(){
    let heart = this.parentNode;
    //console.log("foresttreeclick heart:",heart);
    let [heartindex, index] = heart.className.split("-");//比如two-2
    if(forest[heartindex][index] == ""){ //未中树
        return;
    }
    let [playerindex, tree] = forest[heartindex][index].split("-");//比如0-smalltree
    //需要是当前玩家种的树
    if(current_player_index != playerindex){
        return;
    }
    //本轮已使用过，暂时禁用
    if(!forest_untouch[heartindex][index]){
        return;
    }
    let tree2num = {
        "seed" : 0,
        "smalltree" : 1,
        "mediumtree" : 2,
        "bigtree" : 3,
    }
    //阳光值不够
    if(sunshine_values[current_player_index] < tree2num[tree] + 1){
        return;
    }
    //大树收割，其他升级
    //if(this.hasclicked){
    if(lastclickeddiv == this){
        // heart.style.border = "1px solid #000";
        // let childnodes = heart.children;
        // for (let i = childnodes.length-1; i >=0; i--) {
        //     let childnode = childnodes[i];
        //     if(childnode.tagName == "BUTTON"){
        //         heart.removeChild(childnode);
        //     }
        // }
        //this.hasclicked = false;
        clearlastclick();
    }
    else{
        if(lastclickeddiv != null || affecteddivs.length > 0){
            clearlastclick();
        }
        heart.style.border = "1vh solid " + colors[current_player_index];
        if(tree == "bigtree"){
            //收割
            //heart.innerHTML = "<button onclick='harvestbigtreeclick(event,this)'>收割</button>";
            let btn = document.createElement("BUTTON");
            btn.innerText = "收割";
            btn.onclick = function(){
                harvestbigtreeclick(event, this);
            };
            heart.appendChild(btn);
        }
        else{
            //升级
            //heart.innerHTML = "<button onclick='upgrateclick(event,this)'>升级</button>";
            //判断解锁区里是否有升级后的树
            let nexttree = {
                "seed" : "smalltree",
                "smalltree" : "mediumtree",
                "mediumtree": "bigtree"
            }
            let nexttreename = nexttree[tree];
            let freetree_div = player_divs[current_player_index].getElementsByClassName("free-tree")[0];
            let nexttreedivs = freetree_div.getElementsByClassName(nexttreename);
            if(nexttreedivs.length == 0){
                return;
            }
            let btn = document.createElement("BUTTON");
            btn.innerText = "升级";
            btn.onclick = function(){
                upgrateclick(event, this);
            };
            heart.appendChild(btn);
        }
        //this.hasclicked = true;
        lastclickeddiv = this;
        affecteddivs = [];
    }

}

function beforenormalround(){
    showmessage("请种一颗小树");
    smtreediv = null;
    //设置解锁的小树
    let freetree_div = player_divs[current_player_index].getElementsByClassName("free-tree")[0];
    let smtrees = freetree_div.getElementsByClassName("smalltree");
    //console.log(smtrees.length);
    for (let k = 0; k < smtrees.length; k++) {
        let smtree = smtrees[k];
        //let isplant = false;
        smtree.onclick = function(){
            if(lastclickeddiv == this){
                clearlastclick();
                showoneplant(false);
            }
            else {
                if(lastclickeddiv != null || affecteddivs.length > 0){
                    clearlastclick();
                }
                this.innerHTML = "<button onclick='plantclick(event, this)'>种树</button>";
                this.parentNode.style.border = "1vh solid " + colors[current_player_index];
                lastclickeddiv = this;
                affecteddivs = [];
                showoneplant(true);
            }
            /*
            //修改蛋疼的显示
            if(this.hasclicked && this.parentNode.parentNode.hasclicked){
                this.innerHTML = "";
                this.parentNode.style.border = "none";
                this.hasclicked = false;
                this.parentNode.parentNode.hasclicked = false;
                showoneplant(false);
            }
            else{
                if(this.hasclicked || this.parentNode.parentNode.hasclicked){
                    this.parentNode.parentNode.lastclicked.innerHTML = "";
                    this.parentNode.parentNode.lastclicked.parentNode.style.border = "none";
                    this.parentNode.parentNode.lastclicked.hasclicked = false;
                    showoneplant(false);
                }
                this.innerHTML = "<button onclick='plantclick(event, this)'>种树</button>";
                this.parentNode.style.border = "1vh solid " + colors[current_player_index];
                this.hasclicked = true;
                this.parentNode.parentNode.lastclicked = this;
                this.parentNode.parentNode.hasclicked = true;
                showoneplant(true);
            }
            */
        }
    }
}

//找符合要求的位置的classname
function findownpos(tname){
    let findclassnames = [];
    let treename = current_player_index + "-" + tname;
    //console.log("findownpos for:" + treename);
    let numstrs = ["one", "two", "three", "four"];
    for (let i = 0; i < numstrs.length; i++) {
        const numstr = numstrs[i];
        const numforest = forest[numstr]; //种树情况
        for (let j = 0; j < numforest.length; j++) {
            if(numforest[j] != treename || !forest_untouch[numstr][j]){
                continue;
            }
            //找到要求的
            let classname = numstr + "-" + j;
            findclassnames.push(classname);
        }
    }
    return findclassnames;
}
//未解锁区点击事件
function getunfreeclickfunction(svalue){
    //console.log("getunfreeclickfunction(svalue):" + svalue);
    return function(){
        this.sunvalue = svalue;
        if(sunshine_values[current_player_index] < svalue){
            return; // 阳光值不够，不能升级
        }
        //if(this.hasclicked){
        if(lastclickeddiv == this){
            //this.innerHTML = "";
            //this.parentNode.style.border = "none";
            //this.hasclicked = false;
            clearlastclick();
            unlocktreediv = null;
        }
        else{
            if(lastclickeddiv != null || affecteddivs.length > 0){
                clearlastclick();
            }
            this.innerHTML = "<button onclick='unlockclick(event, this)'>解锁</button>";
            this.parentNode.style.border = "1vh solid " + colors[current_player_index];
            //this.hasclicked = true;
            // if(unlocktreediv){ //非空
            //     unlocktreediv.innerHTML = "";
            //     unlocktreediv.parentNode.style.border = "none";
            //     unlocktreediv.hasclicked = false;
            // }
            unlocktreediv = this;
            lastclickeddiv = this;
            affecteddivs = [];
        }
    };
}

//解锁区种子点击事件
function seedclick(){
    //console.log("seedclick");
    if (sunshine_values[current_player_index] < 1) {
        return; // 阳光值不够，不能播种
    }
    let classnamearray = findseedplantpos();
    if (classnamearray.length == 0) {
        return; //没有可播种的地方
    }
    if(lastclickeddiv == this){
        //重复点击，取消显示
        clearlastclick();
    }
    else{
        if(lastclickeddiv != null || affecteddivs.length > 0){
            //清除上一次点击
            clearlastclick();
        }
        lastclickeddiv = this;
        affecteddivs = classnamearray;
        this.innerHTML = "<button onclick='plantseedclick(event, this)'>播种</button>";
        this.parentNode.style.border = "1vh solid " + colors[current_player_index];
        showbyclassname(true, classnamearray);
    }
    /* //修改一下这蛋疼的显示
    if (this.hasclicked && this.parentNode.parentNode.hasclicked) {
        this.innerHTML = "";
        this.parentNode.style.border = "none";
        this.hasclicked = false;
        this.parentNode.parentNode.hasclicked = false;
        showbyclassname(false, classnamearray);
    }
    else {
        if (this.hasclicked || this.parentNode.parentNode.hasclicked) {
            this.parentNode.parentNode.lastclicked.innerHTML = "";
            this.parentNode.parentNode.lastclicked.parentNode.style.border = "none";
            this.parentNode.parentNode.lastclicked.hasclicked = false;
            showbyclassname(false, classnamearray);
        }
        this.innerHTML = "<button onclick='plantseedclick(event, this)'>播种</button>";
        this.parentNode.style.border = "1vh solid " + colors[current_player_index];
        this.hasclicked = true;
        this.parentNode.parentNode.lastclicked = this;
        this.parentNode.parentNode.hasclicked = true;
        showbyclassname(true, classnamearray);
    }
    */
}
//点击解锁区除种子外事件
function gettreeclickfunction(treename){
    let tree2num = {
        "smalltree" : 1,
        "mediumtree" : 2,
        "bigtree" : 3
    }
    let treenames = ["seed", "smalltree", "mediumtree", "bigtree"];
    let i = tree2num[treename];
    return function(){
        if(sunshine_values[current_player_index] < i){
            return; // 阳光值不够，不能升级
        }
        let classnamearray = findownpos(treenames[i-1]);
        if(classnamearray.length == 0){
            return; //没有可升级的地方
        }
        if(lastclickeddiv == this){
            //重复点击，取消显示
            clearlastclick();
        }
        else{
            if(lastclickeddiv != null || affecteddivs.length > 0){
                //清除上一次点击
                clearlastclick();
            }
            lastclickeddiv = this;
            affecteddivs = classnamearray;
            this.innerHTML = "<button onclick='upgradetreeclick(event, this)'>升级</button>";
            this.parentNode.style.border = "1vh solid " + colors[current_player_index];
            showbyclassname(true, classnamearray);
        }
        /*//修改一下这蛋疼的显示
        if(this.hasclicked && this.parentNode.parentNode.hasclicked){
            this.innerHTML = "";
            this.parentNode.style.border = "none";
            this.hasclicked = false;
            this.parentNode.parentNode.hasclicked = false;
            showbyclassname(false, classnamearray);
        }
        else{
            if(this.hasclicked || this.parentNode.parentNode.hasclicked){
                this.parentNode.parentNode.lastclicked.innerHTML = "";
                this.parentNode.parentNode.lastclicked.parentNode.style.border = "none";
                this.parentNode.parentNode.lastclicked.hasclicked = false;
                showbyclassname(false, classnamearray);
            }
            this.innerHTML = "<button onclick='upgradetreeclick(event, this)'>升级</button>";
            this.parentNode.style.border = "1vh solid " + colors[current_player_index];
            this.hasclicked = true;
            this.parentNode.parentNode.lastclicked = this;
            this.parentNode.parentNode.hasclicked = true;
            showbyclassname(true, classnamearray);
        }
        */
    }
}
function normalround(){
    showmessage("第"+(round_count+1)+"轮：可以播种、种树、解锁、升级树、收割大树");
    //解锁区
    let freetree_div = player_divs[current_player_index].getElementsByClassName("free-tree")[0];
    //种子
    let seeddivs = freetree_div.getElementsByClassName("seed");
    for (let i = 0; i < seeddivs.length; i++) {
        let seeddiv = seeddivs[i];
        seeddiv.onclick = seedclick;
    }
    //小树、中树、大树一起处理
    let treenames = ["seed", "smalltree", "mediumtree", "bigtree"];
    for (let i = 1; i < treenames.length; i++) {
        const treename = treenames[i];
        let treenamedivs = freetree_div.getElementsByClassName(treename);
        //console.log("normalround treenamedivs.length:"+(treenamedivs.length)+",treename:"+treename);
        for (let j = 0; j < treenamedivs.length; j++) {
            let treenamediv = treenamedivs[j];
            treenamediv.onclick = gettreeclickfunction(treename);
        }
    }
    
    //未解锁区
    let unfreetree_div = player_divs[current_player_index].getElementsByClassName("unfree-tree")[0];
    for (let i = 0; i < treenames.length; i++) {
        let treename = treenames[i];
        let treenamedivs = unfreetree_div.getElementsByClassName(treename);
        let lastindex = treenamedivs.length-1;
        if(lastindex >= 0){
            //给最后一个添加
            let lasttreenamediv = treenamedivs[lastindex];
            let sun = {
                "seed" : [2,2,1,1],
                "smalltree" : [3,3,2,2],
                "mediumtree" : [4,3,3],
                "bigtree" : [5,4]
            }
            let svalue = sun[treename][lastindex];
            lasttreenamediv.onclick = getunfreeclickfunction(svalue);
        }

    }
}
function conditionwait(){
    //console.log("conditionwait times_inaround:"+times_inaround);
    if(times_inaround < playerscount){
        setTimeout(conditionwait,1000);
    }
    else if(times_inaround < playerscount * 2){
        setTimeout(conditionwait,1000);
        oneturn = function(){};
    }
    else if(times_inaround == playerscount * 2){
        //oneturn = function(){};
        setTimeout(conditionwait,1000);
    }
    else{
        //只能在这了
        //normallyplant();
        photosynthesis();
    }
}
function simpleconditionwait(){
    console.log("simpleconditionwait times_inaround:"+times_inaround);
    if(times_inaround < playerscount){
        setTimeout(simpleconditionwait,1000);
    }
    else if(times_inaround == playerscount){
        oneturn = function(){};
        setTimeout(simpleconditionwait,1000);
    }
    else{
        //只能在这了
        normallyplant();
        //photosynthesis();
    }
}
//显示光合作用界面
function showphotosynthesisinterface(isshow){
    console.log("showphotosynthesisinterface:"+isshow);
    let photosynthesisdiv = document.getElementsByClassName("photosynthesis")[0];
    if(isshow){
        photosynthesisdiv.style.display = "block";
        //隐藏当前玩家，playerdiv可能为空
        if(player_divs.length > 0){
            let playerdiv = player_divs[current_player_index];
            playerdiv.style.display = "none";
        }
    }
    else{
        photosynthesisdiv.style.display = "none";
        //显示当前玩家，playerdiv可能为空
        if(player_divs.length > 0){
            let playerdiv = player_divs[current_player_index];
            playerdiv.style.display = "block";
        }
    }
}
//调整太阳照射角度
function setsunangles(angle){
    let appdiv = document.getElementById("app");
    console.log(appdiv);
    let bgistyle = "linear-gradient(" + angle + "deg, #fff, #666)";
    console.log(bgistyle);
    appdiv.style.backgroundImage = bgistyle;

}
//计算阳光值 返回数组
function cal_sunshine_values(){
    let resultArray = new Array(playerscount).fill(0);
    const caltool = sunshine_calculator[suns_inaround];
    console.log("cal_sunshine_values suns_inaround:"+suns_inaround);
    let numstrs = ["one", "two", "three", "four"];
    let tree2num = {
        "seed" : 0,
        "smalltree" : 1,
        "mediumtree" : 2,
        "bigtree" : 3,
    }
    for (let i = 0; i < numstrs.length; i++) {
        const numstr = numstrs[i];
        const numforest = forest[numstr]; //种树情况
        const numcaltool = caltool[numstr];
        for (let j = 0; j < numforest.length; j++) {
            if(numforest[j] == ""){ //没树
                continue;
            }
            //判断具体这棵树是否被遮挡
            let isshield = false;
            const [playerindex, tree] = numforest[j].split('-'); //比如0-samlltree
            //console.log("numforest[j]:"+numforest[j]);
            if(tree == "seed"){
                continue; //种子不计算阳光值
            }
            //离树最近的三个可能遮挡位置
            const shelters = numcaltool[j]; //比如['one-3','','']
            for (let k = 0; k < 3; k++) {
                if(shelters[k] != ""){
                    //console.log("shelters[k]:"+shelters[k]);
                    let [str, num] = shelters[k].split('-');
                    //console.log("str:"+str);
                    //console.log("forest[str]:"+forest[str]);
                    if(forest[str][num] != ""){
                        let shieldtree = forest[str][num].split('-')[1]; //遮挡树
                        if(tree2num[shieldtree] > k && tree2num[tree] <= tree2num[shieldtree]){
                            isshield = true; //遮挡物更高
                            break;
                        }
                    }
                }
            }
            if(!isshield){ //没被遮挡，加阳光值
                resultArray[playerindex] += tree2num[tree];
            }
        }
    }
    for (let i = 0; i < resultArray.length; i++) {
        sunshine_values[i] += resultArray[i];
    }
    return resultArray;
}
//修改光合作用显示界面，显示阳光值
function modifyphotosynthesisinterface(values){
    let tbodydiv = document.getElementsByClassName("photosynthesis")[0].getElementsByTagName("tbody")[0];
    //table会自动添加tbody
    let clds = tbodydiv.getElementsByTagName("tr");
    //console.log("clds.length:"+clds.length);
    if(clds.length < 4){
        return;
    }
    let gaindiv  = clds[1];
    let totaldiv = clds[2];
    let scorediv = clds[3];
    for (let i = 0; i < values.length; i++) {
        const value = values[i];
        gaindiv.children[i+1].innerText = '' + value;
        totaldiv.children[i+1].innerText = sunshine_values[i];
        scorediv.children[i+1].innerText = harvest_scores[i];
    }    
}

function photosynthesis(){
    //显示界面
    showphotosynthesisinterface(true);
    //计算阳光值
    let values = cal_sunshine_values();
    //修改显示界面，显示阳光值
    modifyphotosynthesisinterface(values);

}
function gameover(){
    alert("游戏结束！");
}

function normallyplant(){
    console.log("normallyplant");
    //太阳照射
    setsunangles(sun_angles[suns_inaround]);
    photosynthesis(); //光合作用，计算阳光值
    //0-->1,2,3-->normallyplant-->0-->1,2,3
    suns_inaround += (times_inaround > playerscount)?1:0;
    if(suns_inaround == 6){
        suns_inaround = 0;
        round_count++;
    }
    if(round_count >= 3){
        gameover();
    }
}
//开局时种树
function showoneplant(isshow){
    let hearts = document.getElementById("app").getElementsByTagName("div");
    for (let h = 0; h < hearts.length; h++) {
        let heart = hearts[h];
        if(heart.className.startsWith('one')){
            if(isshow){
                let index = heart.className.split("-")[1];
                if(forest["one"][index] === ""){
                    heart.style.border = "1vh solid " + colors[current_player_index];
                }
            }
            else{
                heart.style.border = "1px solid #000";
                //heart.innerHTML = "";
                //里面可能种树，不能直接清空，把button清空
                let childnodes = heart.children;
                for (let i = childnodes.length-1; i >=0; i--) {
                    let childnode = childnodes[i];
                    if(childnode.tagName == "BUTTON"){
                        heart.removeChild(childnode);
                    }
                }
            }
            
        }
        
    }
}
//寻找可以播种的位置classname数组
function findseedplantpos(){
    let classnameset = new Set(); //可以播种的地方
    let numstrs = ["one", "two", "three", "four"];
    let tree2num = {
        "seed" : 0,
        "smalltree" : 1,
        "mediumtree" : 2,
        "bigtree" : 3,
    }
    for (let i = 0; i < numstrs.length; i++) {
        const numstr = numstrs[i];
        const numforest = forest[numstr];
        for (let j = 0; j < numforest.length; j++) {
            if(numforest[j] == ""){
                continue; //没树
            }
            const [playerindex, tree] = numforest[j].split('-'); //比如0-samlltree
            if(playerindex != current_player_index){
                continue; //不是当前玩家的树
            }
            if(tree == "seed"){
                continue; // 种子周围不播种
            }
            const dist = tree2num[tree];
            
            for (let k = 0; k < sunshine_calculator.length; k++) { //6个方向
                const threepos = sunshine_calculator[k][numstr][j];//比如['one-4','one-3','']
                for (let d = 0; d < dist; d++) {
                    const maybeclassname = threepos[d]; //在距离范围内的位置的classname，可能为''
                    if(maybeclassname == ''){
                        continue;
                    }
                    let[str, num] = maybeclassname.split('-');
                    if(forest[str][num] == ""){
                        classnameset.add(maybeclassname); //距离范围内还没被占用
                    }
                }
            }
        } 
    }
    return Array.from(classnameset);
}
//清除上一次显示
function clearlastclick(){
    if(lastclickeddiv != null){
        if(lastclickeddiv.parentNode.className.endsWith("mat")){
            lastclickeddiv.parentNode.style.border = "none";
            lastclickeddiv.innerHTML = "";
        }
        else{
            lastclickeddiv.parentNode.style.border = "1px solid #000";
            //里面可能种树，不能直接清空，把button清空
            let childnodes = lastclickeddiv.parentNode.children;
            for (let j = childnodes.length-1; j >=0; j--) {
                let childnode = childnodes[j];
                if(childnode.tagName == "BUTTON"){
                    lastclickeddiv.parentNode.removeChild(childnode);
                }
            }

        }
    }
    showbyclassname(false, affecteddivs);
    lastclickeddiv = null;
    affecteddivs = [];
}
//显示/隐藏classname所在位置
function showbyclassname(isshow, classnamearray){
    let appdiv = document.getElementById("app");
    for (let i = 0; i < classnamearray.length; i++) {
        const classname = classnamearray[i];
        let targetdiv = appdiv.getElementsByClassName(classname)[0];
        if(isshow){
            targetdiv.style.border = "1vh solid " + colors[current_player_index];
        }
        else{
            targetdiv.style.border = "1px solid #000";
            //里面可能种树，不能直接清空，把button清空
            let childnodes = targetdiv.children;
            for (let j = childnodes.length-1; j >=0; j--) {
                let childnode = childnodes[j];
                if(childnode.tagName == "BUTTON"){
                    targetdiv.removeChild(childnode);
                }
            }
        }
    }
}
function showmessage(message){
    let playerdiv = player_divs[current_player_index];
    let print = playerdiv.getElementsByClassName("print")[0];
    if(print){
        print.innerText = message;
    }
}
//回合结束按钮回调函数
function endround(iplayer){
    let nextplayer = (iplayer + 1) % playerscount;
    changeinterface(nextplayer);
}
//游戏开始啦啦啦啦
function gamemain(){
    //设置界面
    setinterface();
    //史前轮流种树阶段
    //plantinturn(beforenormalround, conditionwait);
    callfunctionbytimes(beforenormalround, photosynthesis, playerscount*2);
}
function gamemain2(){
    //正经轮流种树阶段
    showphotosynthesisinterface(false);
    setsunangles(sun_angles[suns_inaround]);
    //plantinturn(normalround, simpleconditionwait);
    callfunctionbytimes(normalround, normallyplant ,playerscount);
}
