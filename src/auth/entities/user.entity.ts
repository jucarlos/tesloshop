import { Product } from '../../products/entities';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';


@Entity({ name: 'users'})
export class User {


    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true,
        nullable: false,
    })
    email: string;

    @Column('text',{
        nullable: false,
        select: false,
    })
    password: string;

    @Column('text', {
        nullable: false,
    })
    fullName: string;

    @Column('bool', {
        default: true,
    })
    isActive: boolean;

    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[];


    @OneToMany(
        () => Product,
        ( product ) => product.user
    )
    product: Product;



    @BeforeInsert()
    @BeforeUpdate()
    checkFieldBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }








}
