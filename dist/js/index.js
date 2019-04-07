'use strict';

(function(){

	let cardsClass = new appClass('Application class');
	let promise;
	let event;
	let addNew;
	//let appClass;
	function appClass(name){
		this.name = name;

	};

	appClass.prototype.localStor = function(){
		let thisContext = this;

		if(window.fetch && window.localStorage){
			if(!localStorage.getItem('PhrasesDat')){
				return fetch('libs/data/Phrases.json')
					.then(function(response) {
						console.log(response.headers.get('Content-Type'));
						console.log(response.status);
						return response.json();
					})
					.then(function(data) {
						thisContext.JsonDat = data;
						thisContext.filterData();
						localStorage.setItem('PhrasesDat',JSON.stringify(data));
						console.log(thisContext.filterData());
					})
					.catch(function(error) {
						console.log(error);
					})
			}
			else{
				this.JsonDat = JSON.parse(localStorage.getItem('PhrasesDat'));
				thisContext.filterData();
			}
		}

	}

	appClass.prototype.filterData = function(){

		let thisContext = this;

		promise = function(){

			return new Promise(function(){

				return setTimeout(function(){

					thisContext.arrSort = thisContext.JsonDat;
					thisContext.objSorted = {};
					let count = 0;
					let countCol = 1;
					let arrFirstCol = [];
					let arrScdtCol = [];
					const FIRSTCOL_SIZE = Math.round(3 - 0.5 + Math.random() * (5 - 3 + 1));
					const COL_SIZE = 12;
					const COLORS = [
						'color-1',
						'color-2',
						'color-3',
						'color-4',
						'color-5',
						'color-6',
						'color-7',
						'color-8',
						'color-9',
						'color-10'];

					if(localStorage.getItem('cardLastIndex'))
						thisContext.cardLastIndex = parseInt(localStorage.getItem('cardLastIndex'));

					for(let i = 0; i <= thisContext.arrSort.length - 1; i++){

						count ++;
						thisContext.arrSort[i].color = COLORS[Math.round(0 - 0.5 + Math.random() * (9 - 0 + 1))];
						thisContext.arrSort[i].id = i;
						if(!localStorage.getItem('cardLastIndex'))
							thisContext.cardLastIndex = i;

						if(i < FIRSTCOL_SIZE){


							arrFirstCol.push(thisContext.arrSort[i]);
							thisContext.objSorted.col_1 = arrFirstCol.sort(SortRandom).sort(Sortlength);
						}

						if(count > FIRSTCOL_SIZE){


							if(countCol < 2){
								countCol = 2;
								pushCol.call(thisContext ,i,COL_SIZE - 1,countCol);

							}

						}

						if(count >= COL_SIZE){

							countCol ++;
							count = 0;

							pushCol.call(thisContext,i,(i + COL_SIZE),countCol);
						}

					}

				}.call(thisContext),0)

			});
		}

		return promise().then(function(){

			this.cardsBuild();

		}.call(this));

	}

	appClass.prototype.userEvents = function(elm){

		let thisContext = this;
		elm.ondblclick= function(){
			let i = parseInt(this.parentNode.getAttribute('elm-index'));
			for(let j = 0; j < thisContext.JsonDat.length; j++ ){
				if(thisContext.JsonDat[j]['id'] == i)
					thisContext.JsonDat.splice(j,1);
			}
			localStorage.setItem('PhrasesDat',JSON.stringify(thisContext.JsonDat));
			this.parentNode.remove();
		}

		elm.parentNode.childNodes[0].onclick = function(){
			this.parentNode.classList.toggle('redact');

		}

		elm.onclick = function(){
			this.classList.toggle('translate');
		}

		elm.nextElementSibling.childNodes[3].onclick = function(){
			
			if(!elm.nextElementSibling.childNodes[4]) {
				if (this.parentNode.childNodes[0].value || this.parentNode.childNodes[1].value || this.parentNode.childNodes[2].value) {

					if (this.parentNode.childNodes[0].value){
						this.parentNode.previousElementSibling.childNodes[0].innerHTML = this.parentNode.childNodes[0].value;
						let i = parseInt(this.parentNode.parentNode.getAttribute('elm-index'));
						find.call(thisContext,'theme',i,this.parentNode.childNodes[0].value);

					}
					if (this.parentNode.childNodes[1].value){
						this.parentNode.previousElementSibling.childNodes[1].childNodes[0].innerHTML = this.parentNode.childNodes[1].value;
						let i = parseInt(this.parentNode.parentNode.getAttribute('elm-index'));
						find.call(thisContext,'sourceText',i,this.parentNode.childNodes[1].value);

					}
					if (this.parentNode.childNodes[2].value){
						this.parentNode.previousElementSibling.childNodes[1].childNodes[1].innerHTML = this.parentNode.childNodes[2].value;
						let i = parseInt(this.parentNode.parentNode.getAttribute('elm-index'));
						find.call(thisContext,'translation',i,this.parentNode.childNodes[2].value);

					}
					localStorage.setItem('PhrasesDat',JSON.stringify(thisContext.JsonDat));

				} else {
					let warn = document.createElement('div');
					warn.classList.add('lang-cards__warn-msg');
					warn.innerHTML = 'Заполните хотя бы одно поле!';
					this.parentNode.insertBefore(warn, this);
					setTimeout(function () {
						warn.remove()
					}, 1000);
				}
			}
			console.log(thisContext);
		}

	}

	appClass.prototype.cardAdd = function(elm){

		let thisContext = this;
		elm.onclick = function(){
			let count = thisContext.cardLastIndex;
			let parent = this.parentNode;
			let addElm = document.createElement('div');
			count ++;
			addElm.classList.add('lang-cards__card-box-wrapp');
			addElm.setAttribute('elm-index',count);
			addElm.innerHTML = '<i class="far fa-edit"></i><div class="lang-cards__card-box"><h3 class="lang-cards__card-title">Custom card</h3><div class="lang-cards__card-description"><div class="lang-cards__card-sourceText cards-text">You can edit the text of this card.</div><div class="lang-cards__card-translation cards-text">Вы можете редактировать текст этой карточки</div></div></div><div class="lang-cards__redact"><input type="text" placeholder="" name="title"/><input type="text" placeholder="" name="sourceText"/><input type="text" placeholder="" name="description"/><i class="fas fa-check"></i></div>';

			thisContext.JsonDat.push({
				theme: 'custom',
				sourceText: 'custom',
				translation: 'custom',
				color: 'custom',
				id:count
			});

			parent.insertBefore(addElm, this);
			console.log(parent.lastChild.previousElementSibling.childNodes[1]);
			event(parent.lastChild.previousElementSibling.childNodes[1]);
			localStorage.setItem('cardLastIndex', count);
			thisContext.cardLastIndex = count;
				console.log(thisContext);
		}
	}

	appClass.prototype.cardsBuild = function(){

		let str = '';

		for(let key in this.objSorted){

			str += '<div class="col-wh-4 lang-cards__col col-'+key.split('_')[1]+'">'+cardBuild.call(this,this.objSorted['col_'+key.split('_')[1]+''])+'<span class="lang-cards__add-btn btn-col-'+key.split('_')[1]+'">+</span></div>'

			document.querySelectorAll('.colls--box')[0].innerHTML = str;

		}

	}

	function Sortlength(a,b){

		let A = a.sourceText.split(' ').length, B = b.sourceText.split(' ').length;
		if (A > B) return -1;
		if (A < B) return 1;
		return 0;
	}

	function SortRandom(){
		return Math.random() - 0.5;
	}

	function pushCol(index,length,countCol){
		let arr = [];

		for(let i = index; i < length; i++){

			if(this.arrSort[i]){
				arr.push(this.arrSort[i]);
				this.objSorted['col_'+countCol+''] = arr.sort(SortRandom).sort(Sortlength);
			}
		}

	}

	function find(key,i,val){
		for(let j = 0; j < this.JsonDat.length; j++ ){
			if(this.JsonDat[j]['id'] == i)
				this.JsonDat[j][key] = val;
		}
	}

	function cardBuild(obj){

		let str = '';

		for(let i =  0; i < obj.length; i++){

			str += '<div elm-index="'+obj[i]['id']+'" class="lang-cards__card-box-wrapp '+obj[i]['color']+'"><i class="far fa-edit"></i><div class="lang-cards__card-box"><h3 class="lang-cards__card-title">'+obj[i]['theme']+'</h3><div class="lang-cards__card-description"><div class="lang-cards__card-sourceText cards-text">'+obj[i]['sourceText']+'</div><div class="lang-cards__card-translation cards-text">'+obj[i]['translation']+'</div></div></div><div class="lang-cards__redact"><input type="text" placeholder="" name="title"/><input type="text" placeholder="" name="sourceText"/><input type="text" placeholder="" name="description"/><i class="fas fa-check"></i></div></div>'
		}

		return str;

	}


	event = cardsClass.userEvents.bind(cardsClass);
	addNew = cardsClass.cardAdd.bind(cardsClass);

	window.onload = function(){

		let promise = cardsClass.localStor();
		let elm = document.querySelectorAll('.lang-cards__card-box');
		let addBtn = document.querySelectorAll('.lang-cards__add-btn');

		if(promise){

			promise.then(function(){
				let elm = document.querySelectorAll('.lang-cards__card-box');
				let addBtn = document.querySelectorAll('.lang-cards__add-btn');
				for(let i = 0; i < elm.length; i++){
					console.log(elm[i])
					event(elm[i]);
				}
				for(let i = 0; i < addBtn.length; i++){
					addNew(addBtn[i]);
				}
			});
		}

		else{

			for(let i = 0; i < elm.length; i++){
				event(elm[i]);
			}
			for(let i = 0; i < addBtn.length; i++){
				addNew(addBtn[i]);
			}
		}

		console.log(cardsClass)
	}

})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XHJcblxyXG4oZnVuY3Rpb24oKXtcclxuXHJcblx0bGV0IGNhcmRzQ2xhc3MgPSBuZXcgYXBwQ2xhc3MoJ0FwcGxpY2F0aW9uIGNsYXNzJyk7XHJcblx0bGV0IHByb21pc2U7XHJcblx0bGV0IGV2ZW50O1xyXG5cdGxldCBhZGROZXc7XHJcblx0Ly9sZXQgYXBwQ2xhc3M7XHJcblx0ZnVuY3Rpb24gYXBwQ2xhc3MobmFtZSl7XHJcblx0XHR0aGlzLm5hbWUgPSBuYW1lO1xyXG5cclxuXHR9O1xyXG5cclxuXHRhcHBDbGFzcy5wcm90b3R5cGUubG9jYWxTdG9yID0gZnVuY3Rpb24oKXtcclxuXHRcdGxldCB0aGlzQ29udGV4dCA9IHRoaXM7XHJcblxyXG5cdFx0aWYod2luZG93LmZldGNoICYmIHdpbmRvdy5sb2NhbFN0b3JhZ2Upe1xyXG5cdFx0XHRpZighbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ1BocmFzZXNEYXQnKSl7XHJcblx0XHRcdFx0cmV0dXJuIGZldGNoKCdsaWJzL2RhdGEvUGhyYXNlcy5qc29uJylcclxuXHRcdFx0XHRcdC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKHJlc3BvbnNlLmhlYWRlcnMuZ2V0KCdDb250ZW50LVR5cGUnKSk7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1cyk7XHJcblx0XHRcdFx0XHRcdHJldHVybiByZXNwb25zZS5qc29uKCk7XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0LnRoZW4oZnVuY3Rpb24oZGF0YSkge1xyXG5cdFx0XHRcdFx0XHR0aGlzQ29udGV4dC5Kc29uRGF0ID0gZGF0YTtcclxuXHRcdFx0XHRcdFx0dGhpc0NvbnRleHQuZmlsdGVyRGF0YSgpO1xyXG5cdFx0XHRcdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnUGhyYXNlc0RhdCcsSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyh0aGlzQ29udGV4dC5maWx0ZXJEYXRhKCkpO1xyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdC5jYXRjaChmdW5jdGlvbihlcnJvcikge1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2V7XHJcblx0XHRcdFx0dGhpcy5Kc29uRGF0ID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnUGhyYXNlc0RhdCcpKTtcclxuXHRcdFx0XHR0aGlzQ29udGV4dC5maWx0ZXJEYXRhKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHRhcHBDbGFzcy5wcm90b3R5cGUuZmlsdGVyRGF0YSA9IGZ1bmN0aW9uKCl7XHJcblxyXG5cdFx0bGV0IHRoaXNDb250ZXh0ID0gdGhpcztcclxuXHJcblx0XHRwcm9taXNlID0gZnVuY3Rpb24oKXtcclxuXHJcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbigpe1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cclxuXHRcdFx0XHRcdHRoaXNDb250ZXh0LmFyclNvcnQgPSB0aGlzQ29udGV4dC5Kc29uRGF0O1xyXG5cdFx0XHRcdFx0dGhpc0NvbnRleHQub2JqU29ydGVkID0ge307XHJcblx0XHRcdFx0XHRsZXQgY291bnQgPSAwO1xyXG5cdFx0XHRcdFx0bGV0IGNvdW50Q29sID0gMTtcclxuXHRcdFx0XHRcdGxldCBhcnJGaXJzdENvbCA9IFtdO1xyXG5cdFx0XHRcdFx0bGV0IGFyclNjZHRDb2wgPSBbXTtcclxuXHRcdFx0XHRcdGNvbnN0IEZJUlNUQ09MX1NJWkUgPSBNYXRoLnJvdW5kKDMgLSAwLjUgKyBNYXRoLnJhbmRvbSgpICogKDUgLSAzICsgMSkpO1xyXG5cdFx0XHRcdFx0Y29uc3QgQ09MX1NJWkUgPSAxMjtcclxuXHRcdFx0XHRcdGNvbnN0IENPTE9SUyA9IFtcclxuXHRcdFx0XHRcdFx0J2NvbG9yLTEnLFxyXG5cdFx0XHRcdFx0XHQnY29sb3ItMicsXHJcblx0XHRcdFx0XHRcdCdjb2xvci0zJyxcclxuXHRcdFx0XHRcdFx0J2NvbG9yLTQnLFxyXG5cdFx0XHRcdFx0XHQnY29sb3ItNScsXHJcblx0XHRcdFx0XHRcdCdjb2xvci02JyxcclxuXHRcdFx0XHRcdFx0J2NvbG9yLTcnLFxyXG5cdFx0XHRcdFx0XHQnY29sb3ItOCcsXHJcblx0XHRcdFx0XHRcdCdjb2xvci05JyxcclxuXHRcdFx0XHRcdFx0J2NvbG9yLTEwJ107XHJcblxyXG5cdFx0XHRcdFx0aWYobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2NhcmRMYXN0SW5kZXgnKSlcclxuXHRcdFx0XHRcdFx0dGhpc0NvbnRleHQuY2FyZExhc3RJbmRleCA9IHBhcnNlSW50KGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdjYXJkTGFzdEluZGV4JykpO1xyXG5cclxuXHRcdFx0XHRcdGZvcihsZXQgaSA9IDA7IGkgPD0gdGhpc0NvbnRleHQuYXJyU29ydC5sZW5ndGggLSAxOyBpKyspe1xyXG5cclxuXHRcdFx0XHRcdFx0Y291bnQgKys7XHJcblx0XHRcdFx0XHRcdHRoaXNDb250ZXh0LmFyclNvcnRbaV0uY29sb3IgPSBDT0xPUlNbTWF0aC5yb3VuZCgwIC0gMC41ICsgTWF0aC5yYW5kb20oKSAqICg5IC0gMCArIDEpKV07XHJcblx0XHRcdFx0XHRcdHRoaXNDb250ZXh0LmFyclNvcnRbaV0uaWQgPSBpO1xyXG5cdFx0XHRcdFx0XHRpZighbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2NhcmRMYXN0SW5kZXgnKSlcclxuXHRcdFx0XHRcdFx0XHR0aGlzQ29udGV4dC5jYXJkTGFzdEluZGV4ID0gaTtcclxuXHJcblx0XHRcdFx0XHRcdGlmKGkgPCBGSVJTVENPTF9TSVpFKXtcclxuXHJcblxyXG5cdFx0XHRcdFx0XHRcdGFyckZpcnN0Q29sLnB1c2godGhpc0NvbnRleHQuYXJyU29ydFtpXSk7XHJcblx0XHRcdFx0XHRcdFx0dGhpc0NvbnRleHQub2JqU29ydGVkLmNvbF8xID0gYXJyRmlyc3RDb2wuc29ydChTb3J0UmFuZG9tKS5zb3J0KFNvcnRsZW5ndGgpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRpZihjb3VudCA+IEZJUlNUQ09MX1NJWkUpe1xyXG5cclxuXHJcblx0XHRcdFx0XHRcdFx0aWYoY291bnRDb2wgPCAyKXtcclxuXHRcdFx0XHRcdFx0XHRcdGNvdW50Q29sID0gMjtcclxuXHRcdFx0XHRcdFx0XHRcdHB1c2hDb2wuY2FsbCh0aGlzQ29udGV4dCAsaSxDT0xfU0laRSAtIDEsY291bnRDb2wpO1xyXG5cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRpZihjb3VudCA+PSBDT0xfU0laRSl7XHJcblxyXG5cdFx0XHRcdFx0XHRcdGNvdW50Q29sICsrO1xyXG5cdFx0XHRcdFx0XHRcdGNvdW50ID0gMDtcclxuXHJcblx0XHRcdFx0XHRcdFx0cHVzaENvbC5jYWxsKHRoaXNDb250ZXh0LGksKGkgKyBDT0xfU0laRSksY291bnRDb2wpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR9LmNhbGwodGhpc0NvbnRleHQpLDApXHJcblxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gcHJvbWlzZSgpLnRoZW4oZnVuY3Rpb24oKXtcclxuXHJcblx0XHRcdHRoaXMuY2FyZHNCdWlsZCgpO1xyXG5cclxuXHRcdH0uY2FsbCh0aGlzKSk7XHJcblxyXG5cdH1cclxuXHJcblx0YXBwQ2xhc3MucHJvdG90eXBlLnVzZXJFdmVudHMgPSBmdW5jdGlvbihlbG0pe1xyXG5cclxuXHRcdGxldCB0aGlzQ29udGV4dCA9IHRoaXM7XHJcblx0XHRlbG0ub25kYmxjbGljaz0gZnVuY3Rpb24oKXtcclxuXHRcdFx0bGV0IGkgPSBwYXJzZUludCh0aGlzLnBhcmVudE5vZGUuZ2V0QXR0cmlidXRlKCdlbG0taW5kZXgnKSk7XHJcblx0XHRcdGZvcihsZXQgaiA9IDA7IGogPCB0aGlzQ29udGV4dC5Kc29uRGF0Lmxlbmd0aDsgaisrICl7XHJcblx0XHRcdFx0aWYodGhpc0NvbnRleHQuSnNvbkRhdFtqXVsnaWQnXSA9PSBpKVxyXG5cdFx0XHRcdFx0dGhpc0NvbnRleHQuSnNvbkRhdC5zcGxpY2UoaiwxKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnUGhyYXNlc0RhdCcsSlNPTi5zdHJpbmdpZnkodGhpc0NvbnRleHQuSnNvbkRhdCkpO1xyXG5cdFx0XHR0aGlzLnBhcmVudE5vZGUucmVtb3ZlKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZWxtLnBhcmVudE5vZGUuY2hpbGROb2Rlc1swXS5vbmNsaWNrID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0dGhpcy5wYXJlbnROb2RlLmNsYXNzTGlzdC50b2dnbGUoJ3JlZGFjdCcpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRlbG0ub25jbGljayA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHRoaXMuY2xhc3NMaXN0LnRvZ2dsZSgndHJhbnNsYXRlJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZWxtLm5leHRFbGVtZW50U2libGluZy5jaGlsZE5vZGVzWzNdLm9uY2xpY2sgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRcclxuXHRcdFx0aWYoIWVsbS5uZXh0RWxlbWVudFNpYmxpbmcuY2hpbGROb2Rlc1s0XSkge1xyXG5cdFx0XHRcdGlmICh0aGlzLnBhcmVudE5vZGUuY2hpbGROb2Rlc1swXS52YWx1ZSB8fCB0aGlzLnBhcmVudE5vZGUuY2hpbGROb2Rlc1sxXS52YWx1ZSB8fCB0aGlzLnBhcmVudE5vZGUuY2hpbGROb2Rlc1syXS52YWx1ZSkge1xyXG5cclxuXHRcdFx0XHRcdGlmICh0aGlzLnBhcmVudE5vZGUuY2hpbGROb2Rlc1swXS52YWx1ZSl7XHJcblx0XHRcdFx0XHRcdHRoaXMucGFyZW50Tm9kZS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLmNoaWxkTm9kZXNbMF0uaW5uZXJIVE1MID0gdGhpcy5wYXJlbnROb2RlLmNoaWxkTm9kZXNbMF0udmFsdWU7XHJcblx0XHRcdFx0XHRcdGxldCBpID0gcGFyc2VJbnQodGhpcy5wYXJlbnROb2RlLnBhcmVudE5vZGUuZ2V0QXR0cmlidXRlKCdlbG0taW5kZXgnKSk7XHJcblx0XHRcdFx0XHRcdGZpbmQuY2FsbCh0aGlzQ29udGV4dCwndGhlbWUnLGksdGhpcy5wYXJlbnROb2RlLmNoaWxkTm9kZXNbMF0udmFsdWUpO1xyXG5cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmICh0aGlzLnBhcmVudE5vZGUuY2hpbGROb2Rlc1sxXS52YWx1ZSl7XHJcblx0XHRcdFx0XHRcdHRoaXMucGFyZW50Tm9kZS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLmNoaWxkTm9kZXNbMV0uY2hpbGROb2Rlc1swXS5pbm5lckhUTUwgPSB0aGlzLnBhcmVudE5vZGUuY2hpbGROb2Rlc1sxXS52YWx1ZTtcclxuXHRcdFx0XHRcdFx0bGV0IGkgPSBwYXJzZUludCh0aGlzLnBhcmVudE5vZGUucGFyZW50Tm9kZS5nZXRBdHRyaWJ1dGUoJ2VsbS1pbmRleCcpKTtcclxuXHRcdFx0XHRcdFx0ZmluZC5jYWxsKHRoaXNDb250ZXh0LCdzb3VyY2VUZXh0JyxpLHRoaXMucGFyZW50Tm9kZS5jaGlsZE5vZGVzWzFdLnZhbHVlKTtcclxuXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAodGhpcy5wYXJlbnROb2RlLmNoaWxkTm9kZXNbMl0udmFsdWUpe1xyXG5cdFx0XHRcdFx0XHR0aGlzLnBhcmVudE5vZGUucHJldmlvdXNFbGVtZW50U2libGluZy5jaGlsZE5vZGVzWzFdLmNoaWxkTm9kZXNbMV0uaW5uZXJIVE1MID0gdGhpcy5wYXJlbnROb2RlLmNoaWxkTm9kZXNbMl0udmFsdWU7XHJcblx0XHRcdFx0XHRcdGxldCBpID0gcGFyc2VJbnQodGhpcy5wYXJlbnROb2RlLnBhcmVudE5vZGUuZ2V0QXR0cmlidXRlKCdlbG0taW5kZXgnKSk7XHJcblx0XHRcdFx0XHRcdGZpbmQuY2FsbCh0aGlzQ29udGV4dCwndHJhbnNsYXRpb24nLGksdGhpcy5wYXJlbnROb2RlLmNoaWxkTm9kZXNbMl0udmFsdWUpO1xyXG5cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdQaHJhc2VzRGF0JyxKU09OLnN0cmluZ2lmeSh0aGlzQ29udGV4dC5Kc29uRGF0KSk7XHJcblxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRsZXQgd2FybiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0XHRcdFx0d2Fybi5jbGFzc0xpc3QuYWRkKCdsYW5nLWNhcmRzX193YXJuLW1zZycpO1xyXG5cdFx0XHRcdFx0d2Fybi5pbm5lckhUTUwgPSAn0JfQsNC/0L7Qu9C90LjRgtC1INGF0L7RgtGPINCx0Ysg0L7QtNC90L4g0L/QvtC70LUhJztcclxuXHRcdFx0XHRcdHRoaXMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUod2FybiwgdGhpcyk7XHJcblx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdFx0d2Fybi5yZW1vdmUoKVxyXG5cdFx0XHRcdFx0fSwgMTAwMCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGNvbnNvbGUubG9nKHRoaXNDb250ZXh0KTtcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHRhcHBDbGFzcy5wcm90b3R5cGUuY2FyZEFkZCA9IGZ1bmN0aW9uKGVsbSl7XHJcblxyXG5cdFx0bGV0IHRoaXNDb250ZXh0ID0gdGhpcztcclxuXHRcdGVsbS5vbmNsaWNrID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0bGV0IGNvdW50ID0gdGhpc0NvbnRleHQuY2FyZExhc3RJbmRleDtcclxuXHRcdFx0bGV0IHBhcmVudCA9IHRoaXMucGFyZW50Tm9kZTtcclxuXHRcdFx0bGV0IGFkZEVsbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0XHRjb3VudCArKztcclxuXHRcdFx0YWRkRWxtLmNsYXNzTGlzdC5hZGQoJ2xhbmctY2FyZHNfX2NhcmQtYm94LXdyYXBwJyk7XHJcblx0XHRcdGFkZEVsbS5zZXRBdHRyaWJ1dGUoJ2VsbS1pbmRleCcsY291bnQpO1xyXG5cdFx0XHRhZGRFbG0uaW5uZXJIVE1MID0gJzxpIGNsYXNzPVwiZmFyIGZhLWVkaXRcIj48L2k+PGRpdiBjbGFzcz1cImxhbmctY2FyZHNfX2NhcmQtYm94XCI+PGgzIGNsYXNzPVwibGFuZy1jYXJkc19fY2FyZC10aXRsZVwiPkN1c3RvbSBjYXJkPC9oMz48ZGl2IGNsYXNzPVwibGFuZy1jYXJkc19fY2FyZC1kZXNjcmlwdGlvblwiPjxkaXYgY2xhc3M9XCJsYW5nLWNhcmRzX19jYXJkLXNvdXJjZVRleHQgY2FyZHMtdGV4dFwiPllvdSBjYW4gZWRpdCB0aGUgdGV4dCBvZiB0aGlzIGNhcmQuPC9kaXY+PGRpdiBjbGFzcz1cImxhbmctY2FyZHNfX2NhcmQtdHJhbnNsYXRpb24gY2FyZHMtdGV4dFwiPtCS0Ysg0LzQvtC20LXRgtC1INGA0LXQtNCw0LrRgtC40YDQvtCy0LDRgtGMINGC0LXQutGB0YIg0Y3RgtC+0Lkg0LrQsNGA0YLQvtGH0LrQuDwvZGl2PjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCJsYW5nLWNhcmRzX19yZWRhY3RcIj48aW5wdXQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIlwiIG5hbWU9XCJ0aXRsZVwiLz48aW5wdXQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIlwiIG5hbWU9XCJzb3VyY2VUZXh0XCIvPjxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiXCIgbmFtZT1cImRlc2NyaXB0aW9uXCIvPjxpIGNsYXNzPVwiZmFzIGZhLWNoZWNrXCI+PC9pPjwvZGl2Pic7XHJcblxyXG5cdFx0XHR0aGlzQ29udGV4dC5Kc29uRGF0LnB1c2goe1xyXG5cdFx0XHRcdHRoZW1lOiAnY3VzdG9tJyxcclxuXHRcdFx0XHRzb3VyY2VUZXh0OiAnY3VzdG9tJyxcclxuXHRcdFx0XHR0cmFuc2xhdGlvbjogJ2N1c3RvbScsXHJcblx0XHRcdFx0Y29sb3I6ICdjdXN0b20nLFxyXG5cdFx0XHRcdGlkOmNvdW50XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0cGFyZW50Lmluc2VydEJlZm9yZShhZGRFbG0sIHRoaXMpO1xyXG5cdFx0XHRjb25zb2xlLmxvZyhwYXJlbnQubGFzdENoaWxkLnByZXZpb3VzRWxlbWVudFNpYmxpbmcuY2hpbGROb2Rlc1sxXSk7XHJcblx0XHRcdGV2ZW50KHBhcmVudC5sYXN0Q2hpbGQucHJldmlvdXNFbGVtZW50U2libGluZy5jaGlsZE5vZGVzWzFdKTtcclxuXHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2NhcmRMYXN0SW5kZXgnLCBjb3VudCk7XHJcblx0XHRcdHRoaXNDb250ZXh0LmNhcmRMYXN0SW5kZXggPSBjb3VudDtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyh0aGlzQ29udGV4dCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRhcHBDbGFzcy5wcm90b3R5cGUuY2FyZHNCdWlsZCA9IGZ1bmN0aW9uKCl7XHJcblxyXG5cdFx0bGV0IHN0ciA9ICcnO1xyXG5cclxuXHRcdGZvcihsZXQga2V5IGluIHRoaXMub2JqU29ydGVkKXtcclxuXHJcblx0XHRcdHN0ciArPSAnPGRpdiBjbGFzcz1cImNvbC13aC00IGxhbmctY2FyZHNfX2NvbCBjb2wtJytrZXkuc3BsaXQoJ18nKVsxXSsnXCI+JytjYXJkQnVpbGQuY2FsbCh0aGlzLHRoaXMub2JqU29ydGVkWydjb2xfJytrZXkuc3BsaXQoJ18nKVsxXSsnJ10pKyc8c3BhbiBjbGFzcz1cImxhbmctY2FyZHNfX2FkZC1idG4gYnRuLWNvbC0nK2tleS5zcGxpdCgnXycpWzFdKydcIj4rPC9zcGFuPjwvZGl2PidcclxuXHJcblx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jb2xscy0tYm94JylbMF0uaW5uZXJIVE1MID0gc3RyO1xyXG5cclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBTb3J0bGVuZ3RoKGEsYil7XHJcblxyXG5cdFx0bGV0IEEgPSBhLnNvdXJjZVRleHQuc3BsaXQoJyAnKS5sZW5ndGgsIEIgPSBiLnNvdXJjZVRleHQuc3BsaXQoJyAnKS5sZW5ndGg7XHJcblx0XHRpZiAoQSA+IEIpIHJldHVybiAtMTtcclxuXHRcdGlmIChBIDwgQikgcmV0dXJuIDE7XHJcblx0XHRyZXR1cm4gMDtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIFNvcnRSYW5kb20oKXtcclxuXHRcdHJldHVybiBNYXRoLnJhbmRvbSgpIC0gMC41O1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gcHVzaENvbChpbmRleCxsZW5ndGgsY291bnRDb2wpe1xyXG5cdFx0bGV0IGFyciA9IFtdO1xyXG5cclxuXHRcdGZvcihsZXQgaSA9IGluZGV4OyBpIDwgbGVuZ3RoOyBpKyspe1xyXG5cclxuXHRcdFx0aWYodGhpcy5hcnJTb3J0W2ldKXtcclxuXHRcdFx0XHRhcnIucHVzaCh0aGlzLmFyclNvcnRbaV0pO1xyXG5cdFx0XHRcdHRoaXMub2JqU29ydGVkWydjb2xfJytjb3VudENvbCsnJ10gPSBhcnIuc29ydChTb3J0UmFuZG9tKS5zb3J0KFNvcnRsZW5ndGgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZmluZChrZXksaSx2YWwpe1xyXG5cdFx0Zm9yKGxldCBqID0gMDsgaiA8IHRoaXMuSnNvbkRhdC5sZW5ndGg7IGorKyApe1xyXG5cdFx0XHRpZih0aGlzLkpzb25EYXRbal1bJ2lkJ10gPT0gaSlcclxuXHRcdFx0XHR0aGlzLkpzb25EYXRbal1ba2V5XSA9IHZhbDtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGNhcmRCdWlsZChvYmope1xyXG5cclxuXHRcdGxldCBzdHIgPSAnJztcclxuXHJcblx0XHRmb3IobGV0IGkgPSAgMDsgaSA8IG9iai5sZW5ndGg7IGkrKyl7XHJcblxyXG5cdFx0XHRzdHIgKz0gJzxkaXYgZWxtLWluZGV4PVwiJytvYmpbaV1bJ2lkJ10rJ1wiIGNsYXNzPVwibGFuZy1jYXJkc19fY2FyZC1ib3gtd3JhcHAgJytvYmpbaV1bJ2NvbG9yJ10rJ1wiPjxpIGNsYXNzPVwiZmFyIGZhLWVkaXRcIj48L2k+PGRpdiBjbGFzcz1cImxhbmctY2FyZHNfX2NhcmQtYm94XCI+PGgzIGNsYXNzPVwibGFuZy1jYXJkc19fY2FyZC10aXRsZVwiPicrb2JqW2ldWyd0aGVtZSddKyc8L2gzPjxkaXYgY2xhc3M9XCJsYW5nLWNhcmRzX19jYXJkLWRlc2NyaXB0aW9uXCI+PGRpdiBjbGFzcz1cImxhbmctY2FyZHNfX2NhcmQtc291cmNlVGV4dCBjYXJkcy10ZXh0XCI+JytvYmpbaV1bJ3NvdXJjZVRleHQnXSsnPC9kaXY+PGRpdiBjbGFzcz1cImxhbmctY2FyZHNfX2NhcmQtdHJhbnNsYXRpb24gY2FyZHMtdGV4dFwiPicrb2JqW2ldWyd0cmFuc2xhdGlvbiddKyc8L2Rpdj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwibGFuZy1jYXJkc19fcmVkYWN0XCI+PGlucHV0IHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJcIiBuYW1lPVwidGl0bGVcIi8+PGlucHV0IHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJcIiBuYW1lPVwic291cmNlVGV4dFwiLz48aW5wdXQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIlwiIG5hbWU9XCJkZXNjcmlwdGlvblwiLz48aSBjbGFzcz1cImZhcyBmYS1jaGVja1wiPjwvaT48L2Rpdj48L2Rpdj4nXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHN0cjtcclxuXHJcblx0fVxyXG5cclxuXHJcblx0ZXZlbnQgPSBjYXJkc0NsYXNzLnVzZXJFdmVudHMuYmluZChjYXJkc0NsYXNzKTtcclxuXHRhZGROZXcgPSBjYXJkc0NsYXNzLmNhcmRBZGQuYmluZChjYXJkc0NsYXNzKTtcclxuXHJcblx0d2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uKCl7XHJcblxyXG5cdFx0bGV0IHByb21pc2UgPSBjYXJkc0NsYXNzLmxvY2FsU3RvcigpO1xyXG5cdFx0bGV0IGVsbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5sYW5nLWNhcmRzX19jYXJkLWJveCcpO1xyXG5cdFx0bGV0IGFkZEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5sYW5nLWNhcmRzX19hZGQtYnRuJyk7XHJcblxyXG5cdFx0aWYocHJvbWlzZSl7XHJcblxyXG5cdFx0XHRwcm9taXNlLnRoZW4oZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRsZXQgZWxtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmxhbmctY2FyZHNfX2NhcmQtYm94Jyk7XHJcblx0XHRcdFx0bGV0IGFkZEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5sYW5nLWNhcmRzX19hZGQtYnRuJyk7XHJcblx0XHRcdFx0Zm9yKGxldCBpID0gMDsgaSA8IGVsbS5sZW5ndGg7IGkrKyl7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhlbG1baV0pXHJcblx0XHRcdFx0XHRldmVudChlbG1baV0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRmb3IobGV0IGkgPSAwOyBpIDwgYWRkQnRuLmxlbmd0aDsgaSsrKXtcclxuXHRcdFx0XHRcdGFkZE5ldyhhZGRCdG5baV0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZWxzZXtcclxuXHJcblx0XHRcdGZvcihsZXQgaSA9IDA7IGkgPCBlbG0ubGVuZ3RoOyBpKyspe1xyXG5cdFx0XHRcdGV2ZW50KGVsbVtpXSk7XHJcblx0XHRcdH1cclxuXHRcdFx0Zm9yKGxldCBpID0gMDsgaSA8IGFkZEJ0bi5sZW5ndGg7IGkrKyl7XHJcblx0XHRcdFx0YWRkTmV3KGFkZEJ0bltpXSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRjb25zb2xlLmxvZyhjYXJkc0NsYXNzKVxyXG5cdH1cclxuXHJcbn0pKCk7Il19
