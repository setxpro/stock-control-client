import { ConfirmationService, MessageService } from 'primeng/api';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { DeleteProductAction } from 'src/app/models/interfaces/products/event/DeleteProductAction';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProductFormComponent } from '../../components/product-form/product-form.component';

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
  styleUrls: []
})
export class ProductsHomeComponent implements OnDestroy, OnInit {

  private readonly destroy$: Subject<void> = new Subject();
  private ref!: DynamicDialogRef;
  public productsList: Array<GetAllProductsResponse> = []

  constructor(
    private productsService: ProductsService,
    private productsDtTransfer: ProductsDataTransferService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService
  ) {}


  ngOnInit(): void {
      this.getServiceProductsDatas();
  }


  getServiceProductsDatas() {
    const productsLoaded = this.productsDtTransfer.getProductsDatas();

    if (productsLoaded.length > 0) {
      this.productsList = productsLoaded;
    } else {
      this.getAPiProducts();
    }
  }

  getAPiProducts() {
    this.productsService.getAllProducts().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if (res.length > 0) {
          this.productsList = res
        }
      },
      error: (err) => {
        console.log(err)
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao buscar produsos',
          life: 2500
        })
        this.router.navigate(['/dashboard'])
      }
    })
  }

  handleProductAction(event: EventAction):void {
    if (event) {
      // Abrir um component... no caso o form
      this.ref = this.dialogService.open(ProductFormComponent, {
        header: event?.action,
        width: '70%',
        contentStyle: {overflow: 'auto'},
        baseZIndex: 10000,
        maximizable: true,
        data: {
          event: event,
          productDatas: this.productsList
        }
      });
      // Fecha a modal e atualiza a tabela com o novo produto
      this.ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
        next: () => this.getAPiProducts()
      })
    }
  }

  handleDeleteProductAction(event: DeleteProductAction): void {
    if (event) {
      this.confirmationService.confirm({
        message: `Deseja realmente excluir ${event?.productName} ?`,
        header: 'Confirmação de exclusão',
        icon: "pi pi-exclamation-triangle",
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => this.deleteProduct(event?.product_id) // Function delete
      })
    }
  }

  deleteProduct(product_id: string) {
    if (product_id) {
      this.productsService.deleteProduct(product_id).pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          if (response) {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Produto removido com sucesso!',
              life: 2500
            });

            // Atualização em tempo real.. sem precisar de um filter
            this.getAPiProducts();
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Não foi possível remover este produto.',
            life: 2500
          });
        }
      })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
