import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  Inject, 
  Param, 
  Patch, 
  Post, 
  HttpException,
  Query,
  UseGuards
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, throwError } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateInvoiceDto } from 'src/common/dtos/create-invoice-dto';
import { UpdateInvoiceDto } from 'src/common/dtos/update-invoice-dto';
import { PaginationDto } from 'src/common';
import { INVOICES_SERVICE } from 'src/configuration/constants';

@Controller('invoices')
export class InvoicesController {
  constructor(
    @Inject(INVOICES_SERVICE) private readonly invoicesClient: ClientProxy,
  ) {}

  // Crear factura (requiere login)
  @UseGuards(JwtAuthGuard)
  @Post()
  createInvoice(@Body() dto: CreateInvoiceDto) {
    return this.invoicesClient.send({ cmd: 'createInvoice' }, dto).pipe(
      catchError(err =>
        throwError(() =>
          new HttpException(
            err?.message ?? 'Error inesperado en microservicio',
            err?.status ?? 500,
          ),
        ),
      ),
    );
  }

  // Listar facturas (solo ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard(['ADMIN']))
  @Get()
  findAllInvoices(@Query() pagination: PaginationDto) {
    return this.invoicesClient.send({ cmd: 'findAllInvoice' }, pagination).pipe(
      catchError(err =>
        throwError(() =>
          new HttpException(
            err?.message ?? 'Error al obtener facturas',
            err?.status ?? 500,
          ),
        ),
      ),
    );
  }

  // Buscar factura por ID
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoicesClient.send({ cmd: 'findOneInvoice' }, id).pipe(
      catchError(err => {
        const status = err?.status || 500;
        const message = err?.message || 'Factura no encontrada';
        return throwError(() => new HttpException(message, status));
      }),
    );
  }

  // Actualizar factura (solo ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard(['ADMIN']))
  @Patch(':id')
  patchInvoice(@Param('id') id: string, @Body() dto: UpdateInvoiceDto) {
    return this.invoicesClient.send({ cmd: 'updateInvoice' }, { id, dto }).pipe(
      catchError(err =>
        throwError(() =>
          new HttpException(
            err?.message ?? 'Error al actualizar factura',
            err?.status ?? 500,
          ),
        ),
      ),
    );
  }

  // Eliminar factura (solo ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard(['ADMIN']))
  @Delete(':id')
  removeInvoice(@Param('id') id: string) {
    return this.invoicesClient.send({ cmd: 'removeInvoice' }, id).pipe(
      catchError(err => {
        const status = err?.status || 500;
        const message = err?.message || 'Error al eliminar factura';
        return throwError(() => new HttpException(message, status));
      }),
    );
  }
}
