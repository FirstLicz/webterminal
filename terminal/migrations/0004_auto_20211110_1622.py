# Generated by Django 3.2.6 on 2021-11-10 08:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('terminal', '0003_screenrecord'),
    ]

    operations = [
        migrations.AddField(
            model_name='screenrecord',
            name='duration_second',
            field=models.IntegerField(blank=True, null=True, verbose_name='持续N秒'),
        ),
        migrations.AddField(
            model_name='screenrecord',
            name='end_time',
            field=models.DateTimeField(blank=True, null=True, verbose_name='结束时间'),
        ),
        migrations.AddField(
            model_name='screenrecord',
            name='start_time',
            field=models.DateTimeField(auto_now=True, null=True, verbose_name='开始时间'),
        ),
    ]