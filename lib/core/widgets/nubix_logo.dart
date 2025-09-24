import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

class NubixLogo extends StatelessWidget {
  final double size;
  final Color? color;
  final bool showText;

  const NubixLogo({
    Key? key,
    this.size = 60,
    this.color,
    this.showText = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final logoColor = color ?? AppColors.primary;
    
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                logoColor,
                logoColor.withOpacity(0.8),
              ],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(size * 0.2),
            boxShadow: [
              BoxShadow(
                color: logoColor.withOpacity(0.3),
                blurRadius: size * 0.1,
                offset: Offset(0, size * 0.05),
              ),
            ],
          ),
          child: Stack(
            alignment: Alignment.center,
            children: [
              // Background pattern
              CustomPaint(
                size: Size(size * 0.8, size * 0.8),
                painter: NubixLogoPainter(color: Colors.white.withOpacity(0.2)),
              ),
              // Main logo
              Text(
                'N',
                style: TextStyle(
                  fontSize: size * 0.5,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ],
          ),
        ),
        if (showText) ...[
          const SizedBox(height: 8),
          Text(
            'NUBIX',
            style: TextStyle(
              fontSize: size * 0.25,
              fontWeight: FontWeight.bold,
              color: logoColor,
              letterSpacing: 1.5,
            ),
          ),
        ],
      ],
    );
  }
}

class NubixLogoPainter extends CustomPainter {
  final Color color;

  NubixLogoPainter({required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = 2.0
      ..style = PaintingStyle.stroke;

    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 4;

    // Draw crypto-inspired geometric pattern
    for (int i = 0; i < 6; i++) {
      final angle = (i * 60) * (3.14159 / 180);
      final x = center.dx + radius * math.cos(angle);
      final y = center.dy + radius * math.sin(angle);
      
      canvas.drawLine(center, Offset(x, y), paint);
    }
    
    // Draw outer circle
    canvas.drawCircle(center, radius * 1.2, paint);
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => false;
}

// Import for math functions
import 'dart:math' as math;