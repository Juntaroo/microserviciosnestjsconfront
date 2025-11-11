import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('productos')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @MessagePattern({cmd: 'createProduct'} )
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @MessagePattern({cmd: 'findAllProducts'})
  findAll() {
    return this.productsService.findAll();
  }

  @MessagePattern({ cmd: 'findOneProduct' })
findOne(@Payload() id: string) {
  return this.productsService.findOne(id);
}

@MessagePattern({ cmd: 'updateProduct' })
update(@Payload() payload: { id: string; updateProductDto: UpdateProductDto }) {
  const { id, updateProductDto } = payload;
  return this.productsService.update(id, updateProductDto);
}

@MessagePattern({ cmd: 'removeProduct' })
remove(@Payload() id: string) {
  return this.productsService.remove(id);
}

@MessagePattern({ cmd: 'decrease_stock' })
decreaseStock(@Payload() payload: { id: string; quantity: number }) {
  return this.productsService.decreaseStock(payload.id, payload.quantity);
}

@MessagePattern({ cmd: 'restore_stock' })
restoreStock(@Payload() payload: { id: string; quantity: number }) {
  return this.productsService.restoreStock(payload.id, payload.quantity);
}
}