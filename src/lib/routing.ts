import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { buildTree, toRou3 } from "unrouting";

interface RouteInfo {
	[name: string]: string;
}

/**
 * Build routes from the app directory using unrouting
 * Replaces Bun.FileSystemRouter with universal filesystem routing
 */
export function buildRoutesFromAppDir(appDir: string): RouteInfo {
	const routes: RouteInfo = {};

	function walkDir(dir: string, basePath: string = "") {
		try {
			const files = readdirSync(dir);

			for (const file of files) {
				const fullPath = join(dir, file);
				const stat = statSync(fullPath);

				if (stat.isDirectory()) {
					walkDir(fullPath, basePath ? `${basePath}/${file}` : file);
				} else if (file.endsWith(".ts") && !file.endsWith(".d.ts")) {
					const pathSegment = basePath ? `${basePath}/${file}` : file;
					const routePath = `/${pathSegment.replace(/\.ts$/, "").replace(/\\/g, "/")}`;
					routes[routePath] = fullPath;
				}
			}
		} catch (error) {
			// Directory doesn't exist or can't be read
		}
	}

	walkDir(appDir);
	return routes;
}

/**
 * Parse routes using unrouting to get consistent route definitions
 * Converts file paths into a normalized route structure
 */
export function parseRoutesWithUnrouting(filePaths: string[]): {
	path: string;
	file: string;
}[] {
	try {
		const tree = buildTree(filePaths, {
			roots: ["app/"],
			extensions: [".ts"],
		});

		const routes = toRou3(tree);
		return routes;
	} catch (error) {
		// Fallback to simple path-based routing if unrouting fails
		return filePaths.map((file) => ({
			path: `/${file
				.replace(/^app\//, "")
				.replace(/\.ts$/, "")
				.replace(/\\/g, "/")}`,
			file,
		}));
	}
}

/**
 * Convert a route path to command name format
 * /users/[id]/posts -> users/[id]/posts
 */
export function routePathToCommandName(routePath: string): string {
	return routePath.startsWith("/") ? routePath.slice(1) : routePath;
}

/**
 * Match a route path and return the file path
 */
export interface MatchedRoute {
	path: string;
	filePath: string;
	src: string;
}

export function matchRoute(
	routeName: string,
	routes: RouteInfo,
): MatchedRoute | null {
	const normalizedName = routeName.startsWith("/")
		? routeName
		: `/${routeName}`;

	if (normalizedName in routes) {
		const filePath = routes[normalizedName];
		const src = normalizedName.slice(1) + ".ts";
		return {
			path: normalizedName,
			filePath,
			src,
		};
	}

	return null;
}
