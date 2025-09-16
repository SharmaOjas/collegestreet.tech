from manim import *

class FinancialAnalysis(Scene):
    def construct(self):
        # Colors
        teal = "#21808D"    # teal-500
        cream = "#FCFCF9"   # cream-50
        charcoal = "#1F2121" # charcoal-700
        orange = "#A84B2F"  # orange-500

        # Background
        self.camera.background_color = charcoal

        # Title
        title = Text("AI-Powered Financial Data Analysis", 
                     font="Inter", color=teal).scale(0.9)
        self.play(Write(title))
        self.wait(1)

        # Charts (simple bars)
        bars = VGroup(
            Rectangle(height=1, width=0.3, fill_color=teal, fill_opacity=0.9),
            Rectangle(height=2, width=0.3, fill_color=cream, fill_opacity=0.9),
            Rectangle(height=1.5, width=0.3, fill_color=orange, fill_opacity=0.9),
        ).arrange(RIGHT, buff=0.5).next_to(title, DOWN, buff=1)

        self.play(*[GrowFromBottom(bar) for bar in bars])
        self.wait(1)

        # Subtitle
        subtitle = Text("Smarter Insights. Faster Decisions.", 
                        font="Inter", color=cream).scale(0.6)
        subtitle.next_to(bars, DOWN, buff=0.8)

        self.play(FadeIn(subtitle, shift=UP))
        self.wait(2)

        # Outro
        outro = Text("AI Financial Intelligence", font="Inter", color=teal).scale(0.8)
        self.play(FadeOut(title), FadeOut(bars), FadeOut(subtitle))
        self.play(FadeIn(outro, shift=DOWN))
        self.wait(2)
