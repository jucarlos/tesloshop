import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

import { ValidRoles } from 'src/auth/interfaces';

import { User } from '../auth/entities/user.entity';
import { Auth, GetUser } from '../auth/decorators';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth( ValidRoles.user )
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User
    ) {
    return this.productsService.create(createProductDto, user );
  }

  @Get()
  findAll(
    @Query() paginationDto: PaginationDto
  ) {
    
    return this.productsService.findAll( paginationDto );
  }

  @Get(':term')
  findOne(@Param('term' ) term: string) {
    return this.productsService.findOnePlain(term);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
