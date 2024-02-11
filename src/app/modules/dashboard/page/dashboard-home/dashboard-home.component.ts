import { CookieService } from 'ngx-cookie-service';
import { UserService } from './../../../../services/user/user.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { ProductsService } from 'src/app/services/products/products.service';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';
import { AuthResponse } from 'src/app/models/interfaces/user/auth/AuthResponse';
import { Subject, takeUntil } from 'rxjs';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: []
})
export class DashboardHomeComponent implements OnInit, OnDestroy{

  private destroy$ = new Subject<void>();
  public productList: Array<GetAllProductsResponse> = [];
  public userInfo!: AuthResponse;

  public productsChatDatas!: ChartData;
  public productsChartOptions!: ChartOptions;

  constructor(
    private product: ProductsService,
    private messageService: MessageService,
    private productsDataTransferService: ProductsDataTransferService,
    private cookie: CookieService
  ) {}

  ngOnInit(): void {
    this.getProductsDatas();
    this.userInfo = JSON.parse(this.cookie.get("USER_DATA"))
  }

  getProductsDatas(): void {
    this.product.getAllProducts()
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe({
      next: (response) => {
        if (response.length > 0) {
          this.productList = response
          this.productsDataTransferService.setProductsDatas(this.productList)
          this.setProductsChartConfig(); // Executado quando houver produtos disponíveis
        }
      },
      error: (err) => {
        console.log(err)
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao buscar produtos.',
          life: 2500
        })
      }
    })
  }

  setProductsChartConfig():void {

    if (this.productList.length > 0)
    {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary')
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border')

      this.productsChatDatas = {
        labels: this.productList.map((el) => el?.name),
        datasets: [
          {
            label: 'Quantidade',
            backgroundColor: documentStyle.getPropertyValue('--indigo-400'),
            borderColor: documentStyle.getPropertyValue('--indigo-400'),
            hoverBackgroundColor: documentStyle.getPropertyValue('--indigo-500'),
            data: this.productList.map((e) => e.amount)
          }
        ]
      };

      this.productsChartOptions = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
          legend: {
            labels: {
              color: textColor
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
              font: {
                weight: 500,
              },
            },
            grid: {
                color: surfaceBorder
            }
          },
          y: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder
            }
          }
        }
      }
    }
  }

  // Memory Leak
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
