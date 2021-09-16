import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Producto } from 'src/app/models/producto';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.css']
})
export class CrearProductoComponent implements OnInit {

  titulo = 'Crear Producto';
  id: string | null;
  productoForm: FormGroup;
  constructor(private fb:FormBuilder, private router:Router, private toastr:ToastrService,
    private _productoService: ProductoService,
    private aRouter: ActivatedRoute) {
    this.productoForm = this.fb.group({
      producto:['',Validators.required],
      categoria:['',Validators.required],
      ubicacion:['',Validators.required],
      precio:['',Validators.required],
      
    });
    this.id = this.aRouter.snapshot.paramMap.get('id');
   }

  ngOnInit(): void {
    this.esEditar();
  }
  agregarProducto(){
    const PRODUCTO: Producto = {
      nombre: this.productoForm.get('producto')?.value,
      categoria:this.productoForm.get('categoria')?.value,
      ubicacion:this.productoForm.get('ubicacion')?.value,
      precio:this.productoForm.get('precio')?.value,
    }
    if (this.id !=null) {
      
      //Editamos
      this._productoService.editarProducto(this.id,PRODUCTO).subscribe(data =>{
        this.toastr.info('El producto fue actualizado con exito',"Producto actualizado");
        this.router.navigate(['/']);
      },error =>{
        this.toastr.error('No se pudo actualizar',"Producto update error");
  
        console.log(error);
        this.productoForm.reset();
        
      })

    } else {

      //Agregamos
      this._productoService.saveProductos(PRODUCTO).subscribe(data =>{
        this.toastr.success('El producto fue registrado con exito',"Producto");
        this.router.navigate(['/']);
      },error =>{
        this.toastr.error('No se pudo registrar',"Producto error");
  
        console.log(error);
        this.productoForm.reset();
        
      });
      
    }


  }
  esEditar(){
    if (this.id !==null) {
      this.titulo='Editar producto';
      this._productoService.getProducto(this.id).subscribe(data =>{
        this.productoForm.setValue({
          producto:data.nombre,
          categoria:data.categoria,
          ubicacion:data.ubicacion,
          precio:data.precio
        })
      })
      
    }
  };
  

}
