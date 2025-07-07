import { useCarrito } from "../context/CarritoContext";

export default function CardProducto({ producto, onAgregar }) {
	if (!producto) return null;

	const { agregarAlCarrito } = useCarrito();

	return (
		<div className="relative w-[12.875em] h-[16.5em] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)] rounded-md cursor-pointer transition-all duration-200 p-2 pb-[3.4em] group active:scale-95">
			{/* Imagen o placeholder */}
			<div className="bg-gray-100 w-full h-full flex items-center justify-center overflow-hidden rounded-sm">
				{producto.imagen_url ? (
					<img
						src={producto.imagen_url}
						alt={producto.nombre || "Producto"}
						className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
					/>
				) : (
					<p className="text-center text-black text-sm leading-tight px-2">
						This is <br /> a chair.
					</p>
				)}
			</div>

			{/* Nombre */}
			<p className="absolute left-2 bottom-[1.9em] text-gray-800 text-[0.9em] font-sans truncate">
				{producto.nombre}
			</p>

			{/* Precio */}
			<p className="absolute left-2 bottom-2 text-black text-[0.9em] font-bold font-['Arial_Narrow']">
				${producto.precio}
			</p>

			<button
				onClick={() => agregarAlCarrito(producto)}
				className="absolute bottom-[-60px] left-[5%] w-[90%] h-[2.5em] bg-gradient-to-r from-blue-800 to-blue-400 text-white text-[0.75rem] font-semibold uppercase rounded-sm flex items-center justify-center opacity-0 transition-all duration-200 ease-in-out group-hover:bottom-0 group-hover:opacity-100 group-active:scale-95">
				Añadir al carrito
			</button>
		</div>
	);
}
