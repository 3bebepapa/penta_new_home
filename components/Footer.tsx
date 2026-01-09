"use client"

import { Brain, Github, Twitter, Mail, Globe, Shield, Zap, Users, FileText } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">Penta AI</span>
            </div>
            <p className="text-gray-400 text-sm">
              탈중앙화 AI 생태계의 선구자. 연합학습과 블록체인을 통해 더 나은 AI의 미래를 만들어갑니다.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">플랫폼</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  EMAI 프레임워크
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  연합학습 엔진
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  블록체인 통합
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  AIWorks 마켓플레이스
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">리소스</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  개발자 문서
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  API 레퍼런스
                </a>
              </li>
              <li>
                <a
                  href="https://whitepaper.pentaai.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  백서
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  커뮤니티
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  블로그
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">지원</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  도움말 센터
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  문의하기
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  상태 페이지
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  개인정보처리방침
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  이용약관
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400">© 2018 Penta AI. All rights reserved.</div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                시스템 정상 운영 중
              </div>
              <div className="text-sm text-gray-400">Block #{Math.floor(Math.random() * 1000000) + 12847}</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
