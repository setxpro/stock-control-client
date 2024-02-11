import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/response/GetCategoriesResponse';
import { CreateProductRequest } from 'src/app/models/interfaces/products/request/CreateProductRequest';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { ProductsService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: []
})
export class ProductFormComponent implements OnInit, OnDestroy{

  private readonly destroy$: Subject<void> = new Subject<void>();
  public categoriesDatas: Array<GetCategoriesResponse> = [];
  public selectedCategory: Array<{name: string, code: string}> = []

  public addProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    category_id: ['', Validators.required],
    amount: [0, Validators.required]
  })

  constructor(
    private categoryService: CategoriesService,
    private productsService: ProductsService,
    private formBuilder: FormBuilder,
    private message: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
      this.getAllCategories()
  }

  getAllCategories():void {
    this.categoryService.getAllCategories().pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res) => {
        if (res.length > 0) {
          this.categoriesDatas = res
        }
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  handleSubmitAddProduct():void {
    if (this.addProductForm?.value && this.addProductForm?.valid) {
      const requestCreateProduct: CreateProductRequest = {
        name: this.addProductForm.value.name as string,
        price: this.addProductForm.value.price as string,
        description: this.addProductForm.value.description as string,
        category_id: this.addProductForm.value.category_id as string,
        amount: Number(this.addProductForm.value.amount)
      }

      this.productsService.createProduct(requestCreateProduct).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.message.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Produto criado com suceeso!',
              life: 2500
            })
          }
        },
        error: (err) => {
          console.log(err)
            this.message.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Não foi possível cadastrar um produto.',
              life: 2500
            })
        }
      })
    }

    // Limpando os campos do formulário
    this.addProductForm.reset();
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
