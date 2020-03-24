import { CardService } from './../../services/cards.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public cards: any;
  public card: any;
  public imageUrl: string;
  public tipoBusca: number;
  public errorMessage: string;
  public errorMessage2: string;
  public classImageCard: string;
  public iconShowCards: string;
  public showCards: boolean;
  public loading: boolean;
  public cardsShow: any;
  public numberCardsView: number;
  public limitCardsView: number;
  public showButtonMoreCards = false;

  public uniqueCardModal: any;

  public rangeStars: number;
  setRangeStars(valor) {
    this.rangeStars = valor;
  }

  constructor(private cardService: CardService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.tipoBusca = 1;
    this.cards = [];
    this.cardsShow = [];
    this.resetCard();
    this.errorMessage = null;
    this.errorMessage2 = null;
    this.classImageCard = null;
    this.rangeStars = 0;
    this.iconShowCards = `Show results`;
    this.showCards = true;
    this.loading = false;
    this.numberCardsView = 0;
    this.limitCardsView = 0;
  }

  setCardModal(card, content) {
    this.uniqueCardModal = card;
    console.log(this.uniqueCardModal)
    this.modalService.open(content, { size: 'xl' });
  }

  resetCard() {
    this.card = {
      name: ' - ',
      type: ' - ',
      desc: ' - ',
      atk: ' - ',
      def: ' - ',
      card_images: [
        {
          image_url: "./../../../assets/verso-card.png"
        }
      ]
    }
  }

  openCard(content) {
    this.modalService.open(content, { size: 'xl' });
  }

  showAllCards() {
    this.changeIcon();

    this.showCards = !this.showCards;
  }

  changeIcon() {
    if (this.iconShowCards == 'Show results') {
      this.iconShowCards = 'Hide results';
    } else {
      this.iconShowCards = 'Show results';
    }
  }

  // ------------------------ Search
  setTipoBusca(tipo) {
    this.tipoBusca = tipo;
  }
  search(value) {
    //console.log(value);
    this.classImageCard = 'card-change-loading';

    this.cardService.getCardByName(value).subscribe(
      result => {
        if (result) {
          console.log(result);
          this.card = result[0];
          this.errorMessage = null;
          this.classImageCard = 'card-change-success';
        }
      },
      error => {
        if (error) {
          this.resetCard();
          this.errorMessage = "Card not found";
          this.classImageCard = null;
        }
      }
    )
  }
  searchKeyUp(keyCode, value) {
    if (keyCode == 13) {
      this.search(value);
    }
  }
  searchAllCards(name, attr, arch, race, order) {
    this.loading = true;
    let data = {
      fname: '',
      archetype: '',
      level: '',
      attribute: '',
      race: '',
      sort: ''
    };

    if (name.trim() != '') {
      data.fname = `fname=${name}&`;
    }
    if (arch.trim() != '') {
      data.archetype = `archetype=${arch}&`;
    }
    if (this.rangeStars > 0) {
      data.level = `level=${this.rangeStars}&`;
    }
    if (attr != 'All') {
      data.attribute = `attribute=${attr}&`;
    }
    if (race != 'All') {
      data.race = `race=${race}&`;
    }
    if (order != 'None') {
      data.sort = `sort=${order}&`;
    }

    let params = data.fname + data.archetype + data.level + data.attribute + data.race + data.sort + 'misc=yes';

    this.cardService.getCardsByFilters(params).subscribe(
      result => {
        if (result) {
          this.cards = result;
          this.cardsShow = [];
          this.limitCardsView = 20;
          this.showButtonMoreCards = true;

          for (let i = 0; i < this.cards.length; i++) {
            if (i == this.cards.length - 1) {
              this.showButtonMoreCards = false;
            }
            
            if (i < 20) {
              this.cardsShow.push(this.cards[i]);
            } else {
              if ((this.limitCardsView + 20) < this.cards.length) {
                this.limitCardsView += 20;
                break;
              }else{
                break;
              }
            }
          }
          this.loading = false;
        }
      },
      error => {
        if (error) {
          this.errorMessage2 = "No card was found with these characteristics";
          this.loading = false;
        }
      }
    )
  }
  // ------------------------- End Search
  showMoreCards() {    
    let cont = this.limitCardsView;
    for (let i = cont; i < this.cards.length; i++) {
      
      if (i == this.cards.length - 1) {
        this.showButtonMoreCards = false;
      }
      if (i < (cont + 20)) {
        this.cardsShow.push(this.cards[i]);
      } else {
        if ((this.limitCardsView + 20) < this.cards.length) {
          this.limitCardsView += 20;
          break;
        }else{
          break;
        }
      }
    }
    

  }
}
