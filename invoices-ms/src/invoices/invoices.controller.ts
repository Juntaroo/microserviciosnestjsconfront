import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) { }

  @MessagePattern({cmd: 'createInvoice'})
  create(@Payload() createinvoiceDto: CreateInvoiceDto) {
    return this.invoicesService.create(createinvoiceDto);
  }

  @MessagePattern({cmd: 'findAllInvoice'})
  findAll() {
    return this.invoicesService.findAll();
  }

  @MessagePattern({cmd: 'findOneInvoice'})
  findOne(@Payload() id: string) {
    return this.invoicesService.findOne(id);
  }

  @MessagePattern({cmd: 'updateInvoice'})
  update(@Payload() payload: { id: string; data: UpdateInvoiceDto }) {
    return this.invoicesService.update(payload);
  }

  @MessagePattern({cmd: 'removeInvoice'})
  remove(@Payload() id: string) {
    return this.invoicesService.remove(id);
  }
}

