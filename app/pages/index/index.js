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
		} else{
			alert('Use some new browser');
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
