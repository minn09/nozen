"use client";

import { ArrowLeft, Check, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUserPreferencesStore } from "@/store/user-preferences";

export default function SettingsPage() {
	const { theme, setTheme: setThemeNext } = useTheme();
	const { confirmBeforeDelete, setConfirmBeforeDelete } =
		useUserPreferencesStore();

	const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
		setThemeNext(newTheme);
		useUserPreferencesStore.getState().setTheme(newTheme);
	};

	return (
		<div className="min-h-screen bg-background p-8">
			<div className="max-w-xl mx-auto space-y-8">
				<div className="flex items-center gap-4">
					<Link href="/">
						<Button variant="ghost" size="icon">
							<ArrowLeft className="w-4 h-4" />
						</Button>
					</Link>
					<h1 className="text-2xl font-bold text-foreground">Configuración</h1>
				</div>

				<Separator />

				<section className="space-y-4">
					<h2 className="text-lg font-semibold text-foreground">Apariencia</h2>
					<p className="text-sm text-muted-foreground">
						Elige cómo se ve la aplicación.
					</p>
					<div className="flex gap-2">
						<Button
							variant={theme === "light" ? "default" : "outline"}
							onClick={() => handleThemeChange("light")}
						>
							<Sun className="w-4 h-4 mr-2" />
							Claro
						</Button>
						<Button
							variant={theme === "dark" ? "default" : "outline"}
							onClick={() => handleThemeChange("dark")}
						>
							<Moon className="w-4 h-4 mr-2" />
							Oscuro
						</Button>
						<Button
							variant={theme === "system" ? "default" : "outline"}
							onClick={() => handleThemeChange("system")}
						>
							Sistema
						</Button>
					</div>
				</section>

				<Separator />

				<section className="space-y-4">
					<h2 className="text-lg font-semibold text-foreground">Notas</h2>
					<p className="text-sm text-muted-foreground">
						Controla el comportamiento al eliminar notas.
					</p>
					<Button
						variant={confirmBeforeDelete ? "default" : "outline"}
						onClick={() => setConfirmBeforeDelete(!confirmBeforeDelete)}
						className="w-full justify-start"
					>
						{confirmBeforeDelete && <Check className="w-4 h-4 mr-2" />}
						Confirmar eliminación
					</Button>
					<p className="text-xs text-muted-foreground">
						Si está activado, se mostrará un diálogo de confirmación al eliminar
						una nota.
					</p>
				</section>

				<Separator />

				<section className="space-y-2">
					<p className="text-xs text-muted-foreground">
						Versión 1.0.0 • daily-agenda-app
					</p>
				</section>
			</div>
		</div>
	);
}
