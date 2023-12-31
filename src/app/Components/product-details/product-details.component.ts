
import { ChangeDetectorRef, Component, OnInit, Output } from '@angular/core';


import { ActivatedRoute } from '@angular/router';
import {
  faCartShopping,
  faHeart,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import { CartService } from 'src/app/Services/cart/cart.service';
import { ProductsService } from 'src/app/Services/products/products.service';
import { WishlistService } from 'src/app/Services/wishlist/wishlist.service';

export class CartItem {
  CartId!:number;
  productId!:number;
}
export class WihlistItem {
  productId!: number;
}
export class Review {
  content!: string;
  productId!: number;
  userId!: string;

}

@Component({

  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  ID = 0;
  product: any;
  productt:any;
  icon = faStar;
  iconCart = faCartShopping;
  categoryId: any;
  icon2 = faHeart;
  addedtowishlist: boolean = false;
  user = localStorage.getItem('user');

  userId = this.user && JSON.parse(this.user).user.id;

  cartitems: any;
  wishlistitems: any;
  username: any;
  image: any;
  comment:any;
  commentss:any;
  comments:any;
  userName:any;
  reviewId:any;
  Reviewcreated:any;
  Rid:any;
 Rimg:any;
 isloading = true;
 cartId:any;
  wishListResponse:any;
  WishListID:any;
  time:any;

  constructor(
    public route: ActivatedRoute,
    public myService: ProductsService,
    public wishlistService: WishlistService,
    public cartService:CartService,
    private changeDetector: ChangeDetectorRef
  ) {
    this.ID = route.snapshot.params['id'];
    console.log(this.ID);
  }

  ngOnInit(): void {
    console.log(this.userId);
    this.isloading = true;
    console.log(this.ID);
    this.time = new Date().toLocaleString();
        this.myService.getReview(this.ID).subscribe((res)=>{
          console.log(res);
          this.commentss = res;
        })
    this.myService.getProductDetails(this.ID).subscribe({
      next: (res) => {
        console.log(this.ID);
        console.log(res);
        this.isloading = false
        this.product = res;
        this.productt = this.product;
        this.categoryId=this.product.categoryId;
        console.log(this.categoryId);

        // this.myService.getReview(this.ID).subscribe((res)=>{
        //   console.log(res);
        //   this.commentss = res;
        //   this.comments=this.commentss.data;
        // })
      },
      error(err) {
        console.log(err);
      },
    });
    this.cartService.getCartitems(this.userId).subscribe({
      next:(res:any)=>{
      console.log(res);
      this.cartId=res.id;
      console.log(this.cartId)

    },error(err){
      console.log(err);
    }})
    this.wishlistService.getUserWishList(this.userId).subscribe({
      next:(res)=>{
      console.log(res);
      this.wishListResponse=res;
      this.WishListID=this.wishListResponse.id;
    },error(err){
      console.log(err);
    }})
  }


  ngAfterViewChecked(): void {
    this.image = localStorage.getItem('image');
    this.username = localStorage.getItem('name');
    this.changeDetector.detectChanges();
  }


  add() {
    console.log(this.product);
    console.log(`this is userid ${this.userId}`);
    console.log(this.ID);
    console.log(this.cartId);
    let cartitem: CartItem = {
      CartId: this.cartId,
      productId:this.ID,

    };
    console.log(typeof cartitem);
    console.log(cartitem);
    this.myService.addtocart(cartitem).subscribe((res: any) => {
      console.log(res);
      this.cartitems = Number(localStorage.getItem('cartitems'));
      localStorage.setItem('cartitems', this.cartitems + 1);
    });
  }



  AddToWishlist() {
    console.log(this.product);
    console.log(this.product.id)
    console.log(`this is userid ${this.userId}`);
    console.log(this.wishListResponse);
    console.log(this.wishListResponse.id);

    console.log(this.ID);
    let wishlistitem: any = {
      productId: this.ID,
    };
    console.log(typeof wishlistitem);
    console.log(wishlistitem);
    console.log(this.ID);//product id
    //updateditem
    this.myService.addtoWishlist(this.WishListID,wishlistitem).subscribe({
      next:(res) => {
      console.log(res);
      this.addedtowishlist = true;
      this.wishlistitems = Number(localStorage.getItem('wishlistitems'));
      localStorage.setItem('wishlistitems', this.wishlistitems + 1);
    },error:(err)=>{
      console.log(err);
    }
  });
  }

  AddReview(){
    let review :Review ={
      content :this.comment,
      productId:this.ID,
      userId :this.userId,
    }
    console.log(this.ID)
    this.myService.addReview(review).subscribe((res)=>{
      console.log(res);
      // this.Reviewcreated = res;
      // this.Rid= this.Reviewcreated.data._id;
      // console.log(this.Rid);
      // this.comments.push(review);
      // this.comment = "";
      this.myService.getReview(this.ID).subscribe((res)=>{
        console.log(res);
        this.commentss = res;
      })
    })
  }

  DeleteReview(review:any){

    // if(review._id){
    // this.reviewId = review._id;}
    // else{
    //   this.reviewId = this.Rid;
    // }
    // console.log(this.reviewId)
    this.myService.deleteReview(review.id).subscribe((res)=>{
      console.log(res);
      this.commentss.splice(this.commentss.indexOf(review), 1);
  })
}



}
