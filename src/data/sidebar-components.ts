import {
	HandPointing,
	Keyboard,
	Rectangle,
	Square,
	TextH,
} from '@phosphor-icons/react'
import {EHTMLTag} from '../types/EHTMLTag'
import {ISidebarComponent} from './../types/ISidebarComponent'
export const sidebarComponents: ISidebarComponent[] = [
	{type: EHTMLTag.SECTION, icon: Square},
	{type: EHTMLTag.DIV, icon: Rectangle},
	{type: EHTMLTag.HEADING, icon: TextH},
	{type: EHTMLTag.INPUT, icon: Keyboard},
	{type: EHTMLTag.BUTTON, icon: HandPointing},
] as const
