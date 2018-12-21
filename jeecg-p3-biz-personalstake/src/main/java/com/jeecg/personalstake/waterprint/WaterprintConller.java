package com.jeecg.personalstake.waterprint;

import java.awt.image.BufferedImage;
import java.io.InputStream;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.jeecg.personalstake.util.CommonUtils;
import com.jeecg.personalstake.util.DrawTranslucentPngUtil;

@Controller
@RequestMapping("/personalstake/waterprint")
public class WaterprintConller {

	public static InputStream in;
	Logger logger = Logger.getLogger(WaterprintConller.class);

	@RequestMapping(params = "addwaterprint", method = { RequestMethod.GET, RequestMethod.POST })
	public void list(HttpServletRequest request, HttpServletResponse response) throws Exception {
		Object userInfo = request.getSession().getAttribute("userInfo");
		logger.info("userInfo:"+userInfo);
		logger.info("===================添加水印开始=======================");
		BufferedImage drawPic = DrawTranslucentPngUtil.drawTranslucentStringPic(228, 228, 30, getWaterprintInfo(userInfo));
		BufferedImage Img = DrawTranslucentPngUtil.rotateImage(drawPic, 315);
		logger.info("===================添加水印结束=======================");
		ImageIO.write(Img, "PNG", response.getOutputStream());
		logger.info("===================推给页面水印图片=======================");
		// in = new ByteArrayInputStream(os.toByteArray());
		// logger.info("加水印结束");
		// System.out.println("加水印结束");
	}

	public String getWaterprintInfo(Object obj) {
		JSONObject json = JSON.parseObject(obj.toString());
		StringBuffer ip = new StringBuffer("");
		// 操作员id
		String userId = CommonUtils.getStr(json.get("userId"));
		// 单位信息(组织机构)
		String orgNo = CommonUtils.getStr(json.get("orgNo"));
		String dateTime = "";
		InetAddress ia = null;
		try {
			// ip地址
			String localIp = ia.getLocalHost().getHostAddress();
			String[] temp = localIp.split("\\.");
			for (int i = 0; i < temp.length; i++) {
				ip.append(temp[i]);
			}
			// TODO
			// userInfo.put("userIp", user.getUserIp());
			// 时间戳
			SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
			Date date = new Date();
			dateTime = sdf.format(date);
		} catch (UnknownHostException e) {
			e.printStackTrace();
		}
		String info = userId + "\n" + orgNo + "\n" +ip.toString() + "\n" + dateTime;
		return info;

	}
}
