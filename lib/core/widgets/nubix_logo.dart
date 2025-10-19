import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

class NubixLogo extends StatelessWidget {
  final double size;
  final bool showText;
  final bool showBadge;

  const NubixLogo({
    Key? key,
    this.size = 72,
    this.showText = false,
    this.showBadge = true,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final logoMark = SizedBox(
      width: size,
      height: size,
      child: CustomPaint(
        painter: _NubixMarkPainter(showBadge: showBadge),
        size: Size.square(size),
      ),
    );

    if (!showText) {
      return logoMark;
    }

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        logoMark,
        SizedBox(height: size * 0.15),
        Text(
          'NubiX',
          style: TextStyle(
            fontSize: size * 0.32,
            fontWeight: FontWeight.w700,
            color: AppColors.primary,
            letterSpacing: 1.1,
          ),
        ),
      ],
    );
  }
}

class _NubixMarkPainter extends CustomPainter {
  final bool showBadge;

  _NubixMarkPainter({required this.showBadge});

  @override
  void paint(Canvas canvas, Size size) {
    final double stroke = size.width * 0.14;

    final badgePaint = Paint()
      ..color = AppColors.background
      ..style = PaintingStyle.fill;

    if (showBadge) {
      final rect = RRect.fromRectAndRadius(
        Offset.zero & size,
        Radius.circular(size.width * 0.14),
      );
      canvas.drawRRect(rect, badgePaint);

      final shadowPaint = Paint()
        ..color = AppColors.primary.withOpacity(0.08)
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 6);
      canvas.drawRRect(rect.shift(const Offset(0, 2)), shadowPaint);
    }

    final inset = showBadge ? size.width * 0.16 : 0;
    final usable = size.width - (inset * 2);
    final origin = Offset(inset, inset);

    canvas.save();
    canvas.translate(origin.dx, origin.dy);

    final goldPaint = Paint()
      ..color = AppColors.secondary
      ..style = PaintingStyle.stroke
      ..strokeWidth = stroke
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    final navyPaint = Paint()
      ..color = AppColors.primary
      ..style = PaintingStyle.stroke
      ..strokeWidth = stroke * 0.72
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    final Path goldPath = Path()
      ..moveTo(usable * 0.1, usable * 0.95)
      ..lineTo(usable * 0.1, usable * 0.12)
      ..lineTo(usable * 0.46, usable * 0.58)
      ..lineTo(usable * 0.46, usable * 0.08)
      ..lineTo(usable * 0.92, usable * 0.92);

    canvas.drawPath(goldPath, goldPaint);

    final Path navyPath = Path()
      ..moveTo(usable * 0.32, usable * 0.92)
      ..lineTo(usable * 0.32, usable * 0.48)
      ..lineTo(usable * 0.66, usable * 0.88)
      ..lineTo(usable * 0.66, usable * 0.34)
      ..lineTo(usable * 0.84, usable * 0.54);

    canvas.drawPath(navyPath, navyPaint);

    final Path arrowStem = Path()
      ..moveTo(usable * 0.66, usable * 0.24)
      ..lineTo(usable * 0.66, usable * 0.04)
      ..lineTo(usable * 0.9, usable * 0.04);

    canvas.drawPath(arrowStem, navyPaint);

    final Path arrowHead = Path()
      ..moveTo(usable * 0.9, usable * 0.04)
      ..lineTo(usable * 0.9, usable * 0.28)
      ..lineTo(usable * 0.78, usable * 0.16)
      ..close();

    final arrowPaint = Paint()
      ..color = AppColors.primary
      ..style = PaintingStyle.fill;

    canvas.drawPath(arrowHead, arrowPaint);

    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}