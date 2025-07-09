import { HiShoppingCart } from "react-icons/hi";

export default function Header() {
	return (
		<>
			<header className="bg-gradient-to-r from-blue-700 to-blue-300 text-white p-4">
				<div className="container mx-auto flex items-center space-x-8">
					<img src="/logo.png" alt="Logo" className="h-10 w-auto" />

					<nav>
						<ul className="flex space-x-6 text-lg font-medium">
							{/* Inicio*/}
							<li>
								<a
									href="/"
									className="
                    text-white
                    hover:text-red-500
                    transition-colors duration-300
                    cursor-pointer
                    select-none
                  ">
									Inicio
								</a>
							</li>
							{/* Productos */}
							<li>
								<a
									href="/productos"
									className="
                    text-white
                    hover:text-red-500
                    transition-colors duration-300
                    cursor-pointer
                    select-none
                  ">
									Productos
								</a>
							</li>
							{/* Carrito de pedidos */}
							<li>
								<div className="flex items-center space-x-2">
									<a
										href="/pedidos"
										className="
                      text-white
                      hover:text-red-500
                      transition-colors duration-300
                      cursor-pointer
                      select-none
                      flex items-center space-x-2
                    ">
										<HiShoppingCart className="me-1" />
										Mis Pedidos
									</a>
								</div>
							</li>
						</ul>
					</nav>
				</div>
			</header>
		</>
	);
}
